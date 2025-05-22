import { useEffect, useRef, useState } from 'react';
import { Character } from '../types';
import { toast } from '@/components/ui/sonner';

interface AudioTrack {
  character: Character;
  audio: HTMLAudioElement;
  isPlaying: boolean;
}

export function useAudioSynchronizer() {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioInitializedRef = useRef<boolean>(false);

  // Initialize audio context on first user interaction
  useEffect(() => {
    const initAudio = () => {
      if (audioInitializedRef.current) return;
      
      console.log('Initializing audio context...');
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioInitializedRef.current = true;
        console.log('Audio context initialized successfully');
      } catch (error) {
        console.error('Failed to initialize audio context:', error);
        toast.error('Failed to initialize audio playback');
      }
      
      // Resume any paused tracks
      tracks.forEach(track => {
        if (track.isPlaying && track.audio.paused) {
          playAudio(track.audio).catch(err => 
            console.error('Error resuming audio:', err)
          );
        }
      });
    };
    
    // Setup event listeners for user interaction
    const events = ['click', 'touchstart', 'keydown'];
    events.forEach(event => document.addEventListener(event, initAudio, { once: true }));
    
    return () => {
      events.forEach(event => document.removeEventListener(event, initAudio));
    };
  }, [tracks]);

  // Helper function to play audio with proper error handling
  const playAudio = async (audio: HTMLAudioElement): Promise<void> => {
    try {
      if (audio.readyState < 2) { // HAVE_CURRENT_DATA (2) or higher needed
        return new Promise((resolve, reject) => {
          const loadHandler = () => {
            audio.play()
              .then(resolve)
              .catch(reject);
          };
          
          audio.addEventListener('canplaythrough', loadHandler, { once: true });
          
          audio.addEventListener('error', (e) => {
            console.error(`Audio loading error in playAudio:`, e);
            reject(new Error(`Audio loading error: ${e.type}`));
          }, { once: true });
          
          // Timeout in case audio never loads
          setTimeout(() => {
            reject(new Error('Audio loading timeout'));
          }, 5000);
        });
      } else {
        return audio.play();
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      throw error;
    }
  };
  
  // Add track and start playing immediately
  const addTrack = (character: Character) => {
    console.log('Adding track for character:', character.name, 'with audio:', character.audioTrack);
    
    // Check if track already exists for this character
    if (tracks.some(track => track.character.id === character.id)) {
      console.log('Track already exists for this character, skipping');
      return;
    }
    
    // Create new audio element specifically for this character
    const audio = new Audio();
    audio.src = character.audioTrack;
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.7; // Default volume
    
    // Add track to state immediately (but don't play yet)
    const newTrack: AudioTrack = { character, audio, isPlaying: false };
    setTracks(prev => [...prev, newTrack]);
    
    // Set up event listeners for debugging
    audio.addEventListener('canplaythrough', () => {
      console.log('Audio loaded and ready to play for:', character.name);
      setTracks(prev => 
        prev.map(t => 
          t.character.id === character.id 
            ? { ...t, isPlaying: true } 
            : t
        )
      );
      
      // Play this audio without affecting other tracks
      playAudio(audio)
        .then(() => console.log('Started playing audio for:', character.name))
        .catch(err => {
          console.error('Error playing audio for:', character.name, err);
          toast.error(`Failed to play audio for ${character.name}`);
        });
    }, { once: true });
    
    audio.addEventListener('error', (e) => {
      console.error(`Audio error for ${character.name}:`, e);
      toast.error(`Audio error for ${character.name}`);
      
      // Remove this track from state if it errors
      setTracks(prev => prev.filter(t => t.character.id !== character.id));
    });
    
    // Start loading the audio
    audio.load();
  };
  
  // Remove track and stop its audio
  const removeTrack = (characterId: string) => {
    console.log('Removing track for character ID:', characterId);
    
    const trackToRemove = tracks.find(t => t.character.id === characterId);
    if (trackToRemove) {
      try {
        // Just pause and clean up this specific audio element
        trackToRemove.audio.pause();
        trackToRemove.audio.currentTime = 0;
        trackToRemove.audio.src = '';
        console.log('Stopped audio for:', trackToRemove.character.name);
      } catch (error) {
        console.error('Error stopping audio:', error);
      }
      
      // Only remove this specific track from state, keeping others intact
      setTracks(prev => prev.filter(t => t.character.id !== characterId));
    }
  };
  
  // Set volume for all audio tracks
  const setVolume = (volume: number) => {
    tracks.forEach(track => {
      try {
        track.audio.volume = volume;
      } catch (error) {
        console.error('Error setting volume:', error);
      }
    });
  };
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      console.log('Cleaning up audio synchronizer, stopping all tracks');
      tracks.forEach(track => {
        try {
          track.audio.pause();
          track.audio.currentTime = 0;
          track.audio.src = '';
        } catch (error) {
          console.error('Error during audio cleanup:', error);
        }
      });
    };
  }, [tracks]);
  
  return {
    tracks,
    addTrack,
    removeTrack,
    setVolume,
    isPlaying: tracks.some(track => track.isPlaying && !track.audio.paused)
  };
}
