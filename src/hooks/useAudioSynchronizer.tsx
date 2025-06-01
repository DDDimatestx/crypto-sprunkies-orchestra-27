
import { useEffect, useRef, useState } from 'react';
import { Character } from '../types';
import { toast } from '@/components/ui/sonner';

interface AudioTrack {
  character: Character;
  audio: HTMLAudioElement;
  isPlaying: boolean;
}

export function useAudioSynchronizer() {
  const [audioMap, setAudioMap] = useState<Map<string, HTMLAudioElement>>(new Map());
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize audio context on first user interaction
  useEffect(() => {
    const initAudio = () => {
      if (isInitialized) return;
      console.log('Audio system initialized');
      setIsInitialized(true);
    };
    
    const events = ['click', 'touchstart', 'keydown'];
    events.forEach(event => document.addEventListener(event, initAudio, { once: true }));
    
    return () => {
      events.forEach(event => document.removeEventListener(event, initAudio));
    };
  }, [isInitialized]);

  const addTrack = async (character: Character) => {
    console.log('Adding track for character:', character.name, 'with audio:', character.audioTrack);
    
    // Check if track already exists
    if (audioMap.has(character.id)) {
      console.log('Track already exists for this character, skipping');
      return;
    }
    
    try {
      // Create new audio element for this character
      const audio = new Audio();
      audio.src = character.audioTrack;
      audio.loop = true;
      audio.volume = 0.7;
      audio.preload = 'auto';
      
      // Add to map immediately
      setAudioMap(prev => new Map(prev.set(character.id, audio)));
      
      // Set up event listeners
      audio.addEventListener('canplaythrough', async () => {
        console.log('Audio loaded for:', character.name);
        try {
          await audio.play();
          console.log('Started playing audio for:', character.name);
        } catch (error) {
          console.error('Error playing audio for:', character.name, error);
          toast.error(`Failed to play audio for ${character.name}`);
        }
      }, { once: true });
      
      audio.addEventListener('error', (e) => {
        console.error(`Audio error for ${character.name}:`, e);
        toast.error(`Audio error for ${character.name}`);
        // Remove from map on error
        setAudioMap(prev => {
          const newMap = new Map(prev);
          newMap.delete(character.id);
          return newMap;
        });
      });
      
      // Load the audio
      audio.load();
      
    } catch (error) {
      console.error('Error creating audio for:', character.name, error);
      toast.error(`Error creating audio for ${character.name}`);
    }
  };
  
  const removeTrack = (characterId: string) => {
    console.log('Removing track for character ID:', characterId);
    
    const audio = audioMap.get(characterId);
    if (audio) {
      try {
        audio.pause();
        audio.currentTime = 0;
        audio.src = '';
        console.log('Stopped audio for character ID:', characterId);
      } catch (error) {
        console.error('Error stopping audio:', error);
      }
      
      // Remove from map
      setAudioMap(prev => {
        const newMap = new Map(prev);
        newMap.delete(characterId);
        return newMap;
      });
    }
  };
  
  const setVolume = (volume: number) => {
    audioMap.forEach((audio, characterId) => {
      try {
        audio.volume = volume;
      } catch (error) {
        console.error('Error setting volume for character:', characterId, error);
      }
    });
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      console.log('Cleaning up audio synchronizer');
      audioMap.forEach((audio, characterId) => {
        try {
          audio.pause();
          audio.currentTime = 0;
          audio.src = '';
        } catch (error) {
          console.error('Error during cleanup for character:', characterId, error);
        }
      });
    };
  }, [audioMap]);
  
  // Convert map to tracks array for compatibility
  const tracks = Array.from(audioMap.entries()).map(([characterId, audio]) => ({
    character: { id: characterId } as Character,
    audio,
    isPlaying: !audio.paused
  }));
  
  return {
    tracks,
    addTrack,
    removeTrack,
    setVolume,
    isPlaying: tracks.some(track => track.isPlaying)
  };
}
