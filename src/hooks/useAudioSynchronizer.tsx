import { useEffect, useRef, useState } from 'react';
import { Character } from '../types';

interface AudioTrack {
  character: Character;
  audio: HTMLAudioElement;
  isPlaying: boolean;
}

export function useAudioSynchronizer() {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const cycleTimeRef = useRef<number>(0);
  const loopLengthRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  
  // Add track and start playing immediately
  const addTrack = (character: Character) => {
    console.log('Adding track for character:', character.name, 'with audio:', character.audioTrack);
    
    if (tracks.some(track => track.character.id === character.id)) {
      console.log('Track already exists for this character, skipping');
      return;
    }
    
    const audio = new Audio(character.audioTrack);
    audio.loop = true; // Set looping enabled for continuous playback
    
    // Add event listeners for debugging
    audio.addEventListener('error', (e) => {
      console.error('Audio error for', character.name, ':', e);
    });
    
    audio.addEventListener('canplaythrough', () => {
      console.log('Audio loaded and can play through for', character.name);
    });
    
    audio.addEventListener('ended', () => {
      console.log('Audio ended for', character.name, '- should loop automatically');
    });
    
    audio.addEventListener('loadedmetadata', () => {
      console.log('Audio metadata loaded for', character.name, 'duration:', audio.duration);
      
      // Set loop length if this is the first track
      if (loopLengthRef.current === 0) {
        loopLengthRef.current = audio.duration;
        console.log('Set loop length to', loopLengthRef.current);
      }
      
      setTracks(prev => [
        ...prev, 
        { character, audio, isPlaying: false }
      ]);
      
      // Start playing immediately
      audio.play().then(() => {
        console.log('Started playing', character.name);
        setTracks(prev => 
          prev.map(track => 
            track.character.id === character.id 
              ? { ...track, isPlaying: true } 
              : track
          )
        );
      }).catch(err => {
        console.error('Error playing audio for', character.name, ':', err);
      });
    });
  };
  
  // Remove track and stop its audio
  const removeTrack = (characterId: string) => {
    console.log('Removing track for character ID:', characterId);
    
    const trackToRemove = tracks.find(t => t.character.id === characterId);
    if (trackToRemove) {
      // Pause and reset the audio before removing
      trackToRemove.audio.pause();
      trackToRemove.audio.currentTime = 0;
      trackToRemove.audio.src = '';
      console.log('Stopped audio for', trackToRemove.character.name);
    }
    
    setTracks(prev => prev.filter(t => t.character.id !== characterId));
  };
  
  // Start all tracks (not needed anymore as we auto-start, but keeping for API compatibility)
  const startAll = () => {
    console.log('Starting all tracks, count:', tracks.length);
    
    if (!tracks.length) {
      console.warn('No tracks to play');
      return;
    }
    
    // Reset cycle time and set start time reference
    cycleTimeRef.current = 0;
    startTimeRef.current = performance.now();
    
    // Start all tracks from beginning
    tracks.forEach(track => {
      console.log('Starting track for', track.character.name);
      track.audio.currentTime = 0;
      track.audio.play().catch(err => {
        console.error('Error playing', track.character.name, ':', err);
      });
    });
    
    // Update track state to reflect that they're playing
    setTracks(prev => 
      prev.map(track => ({ ...track, isPlaying: true }))
    );
    
    // Start animation frame for tracking cycle time
    const animate = (time: number) => {
      cycleTimeRef.current = (time - startTimeRef.current) / 1000 % loopLengthRef.current;
      rafIdRef.current = requestAnimationFrame(animate);
    };
    
    rafIdRef.current = requestAnimationFrame(animate);
  };
  
  // Stop all tracks (kept for API compatibility)
  const stopAll = () => {
    console.log('Stopping all tracks');
    
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    
    tracks.forEach(track => {
      track.audio.pause();
      track.audio.currentTime = 0;
    });
    
    setTracks(prev => 
      prev.map(track => ({ ...track, isPlaying: false }))
    );
  };
  
  // Set volume for all audio tracks
  const setVolume = (volume: number) => {
    tracks.forEach(track => {
      track.audio.volume = volume;
    });
  };
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      console.log('Cleaning up audio synchronizer');
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      tracks.forEach(track => {
        track.audio.pause();
        track.audio.currentTime = 0;
        track.audio.src = '';
      });
    };
  }, [tracks]);
  
  // Enable audio playback on user interaction (required for many browsers)
  useEffect(() => {
    const resumeAudio = () => {
      console.log('User interaction detected, resuming audio context if needed');
      // Some browsers require user interaction to play audio
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      // Resume any paused tracks that should be playing
      tracks.forEach(track => {
        if (track.isPlaying && track.audio.paused) {
          track.audio.play().catch(err => 
            console.error('Error resuming audio:', err)
          );
        }
      });
      
      // Remove event listeners after permission granted
      document.removeEventListener('click', resumeAudio);
      document.removeEventListener('touchstart', resumeAudio);
    };
    
    document.addEventListener('click', resumeAudio);
    document.addEventListener('touchstart', resumeAudio);
    
    return () => {
      document.removeEventListener('click', resumeAudio);
      document.removeEventListener('touchstart', resumeAudio);
    };
  }, [tracks]);
  
  return {
    tracks,
    addTrack,
    removeTrack,
    startAll,  // Keep for API compatibility
    stopAll,   // Keep for API compatibility
    setVolume,
    currentCycleTime: cycleTimeRef.current,
    isPlaying: tracks.some(track => track.isPlaying)
  };
}
