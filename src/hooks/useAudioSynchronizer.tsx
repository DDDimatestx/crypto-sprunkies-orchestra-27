
import { useEffect, useRef, useState } from 'react';
import { Character } from '../types';
import { toast } from '@/components/ui/sonner';

export function useAudioSynchronizer() {
  const [audioMap, setAudioMap] = useState<Map<string, HTMLAudioElement>>(new Map());
  const [isInitialized, setIsInitialized] = useState(false);

  // Manual initialization function
  const initializeAudio = () => {
    console.log('Audio system manually initialized');
    setIsInitialized(true);
    toast.success('Audio system ready!');
  };

  const addTrack = async (character: Character) => {
    console.log('Adding track for character:', character.name, 'with audio:', character.audioTrack);
    
    // Check if track already exists
    if (audioMap.has(character.id)) {
      console.log('Track already exists for this character, skipping');
      return;
    }

    // Check if user has interacted with page
    if (!isInitialized) {
      toast.error('Please click "Enable Audio" button first to allow sound playback');
      return;
    }
    
    try {
      // Create new audio element for this character
      const audio = new Audio();
      
      // Set up event listeners BEFORE setting src
      audio.addEventListener('loadeddata', async () => {
        console.log('Audio loaded successfully for:', character.name);
        try {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            await playPromise;
            console.log('Successfully started playing audio for:', character.name);
            toast.success(`Playing ${character.name}`);
          }
        } catch (error) {
          console.error('Error playing audio for:', character.name, error);
          toast.error(`Failed to play audio for ${character.name}`);
          // Remove from map on play error
          setAudioMap(prev => {
            const newMap = new Map(prev);
            newMap.delete(character.id);
            return newMap;
          });
        }
      });
      
      audio.addEventListener('error', (e) => {
        console.error(`Audio loading error for ${character.name}:`, e);
        console.error('Audio error details:', audio.error);
        console.error('Attempted to load:', character.audioTrack);
        
        let errorMessage = 'Unknown audio error';
        if (audio.error) {
          switch (audio.error.code) {
            case 1:
              errorMessage = 'Loading aborted';
              break;
            case 2:
              errorMessage = 'Network error';
              break;
            case 3:
              errorMessage = 'Decode error';
              break;
            case 4:
              errorMessage = 'Audio format not supported';
              break;
            default:
              errorMessage = `Error code: ${audio.error.code}`;
          }
        }
        
        toast.error(`Audio error for ${character.name}: ${errorMessage}`);
        
        // Remove from map on error
        setAudioMap(prev => {
          const newMap = new Map(prev);
          newMap.delete(character.id);
          return newMap;
        });
      });

      audio.addEventListener('canplay', () => {
        console.log('Audio can start playing for:', character.name);
      });
      
      // Configure audio properties
      audio.loop = true;
      audio.volume = 0.7;
      audio.preload = 'auto';
      
      // Set src AFTER event listeners are attached
      console.log('Setting audio source:', character.audioTrack);
      audio.src = character.audioTrack;
      
      // Add to map immediately after setting src
      setAudioMap(prev => new Map(prev.set(character.id, audio)));
      
      // Load the audio
      console.log('Loading audio file...');
      audio.load();
      
    } catch (error) {
      console.error('Error creating audio for:', character.name, error);
      toast.error(`Error creating audio for ${character.name}: ${error.message}`);
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
        console.log(`Set volume to ${volume} for character ${characterId}`);
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
    isPlaying: tracks.some(track => track.isPlaying),
    isInitialized,
    initializeAudio
  };
}
