
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
  
  // Add a new audio track for a character
  const addTrack = (character: Character) => {
    if (tracks.some(track => track.character.id === character.id)) return;
    
    const audio = new Audio(character.audioTrack);
    audio.loop = true;
    
    audio.addEventListener('loadedmetadata', () => {
      // If this is the first track, set the loop length
      if (tracks.length === 0) {
        loopLengthRef.current = audio.duration;
      }
      
      setTracks(prev => [
        ...prev, 
        { character, audio, isPlaying: false }
      ]);
      
      // If we already have tracks playing, sync this one
      if (tracks.some(t => t.isPlaying)) {
        const currentTime = (performance.now() - startTimeRef.current) / 1000 % loopLengthRef.current;
        audio.currentTime = currentTime;
        audio.play();
      }
    });
  };
  
  // Remove a track
  const removeTrack = (characterId: string) => {
    setTracks(prev => {
      const newTracks = prev.filter(t => t.character.id !== characterId);
      const trackToRemove = prev.find(t => t.character.id === characterId);
      
      if (trackToRemove) {
        trackToRemove.audio.pause();
        trackToRemove.audio.src = '';
      }
      
      return newTracks;
    });
  };
  
  // Start all tracks in sync
  const startAll = () => {
    if (!tracks.length) return;
    
    // Reset cycle time and set start time reference
    cycleTimeRef.current = 0;
    startTimeRef.current = performance.now();
    
    // Start all tracks from the beginning
    tracks.forEach(track => {
      track.audio.currentTime = 0;
      track.audio.play();
    });
    
    // Update tracks state to reflect they are playing
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
  
  // Stop all tracks
  const stopAll = () => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    
    tracks.forEach(track => {
      track.audio.pause();
    });
    
    setTracks(prev => 
      prev.map(track => ({ ...track, isPlaying: false }))
    );
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      tracks.forEach(track => {
        track.audio.pause();
        track.audio.src = '';
      });
    };
  }, [tracks]);
  
  return {
    tracks,
    addTrack,
    removeTrack,
    startAll,
    stopAll,
    currentCycleTime: cycleTimeRef.current,
    isPlaying: tracks.some(track => track.isPlaying)
  };
}
