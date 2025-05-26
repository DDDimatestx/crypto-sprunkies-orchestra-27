
import { useState, useEffect, useRef } from 'react';

interface UseAudioProps {
  src: string | undefined;
  loop?: boolean;
  autoPlay?: boolean;
  volume?: number;
}

export function useAudio({
  src,
  loop = true,
  autoPlay = true,
  volume = 1,
}: UseAudioProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!src) return;

    const audio = new Audio(src);
    audioRef.current = audio;
    
    audio.loop = loop;
    audio.volume = volume;
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
      if (autoPlay) {
        play();
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      if (!loop) {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [src, loop, autoPlay, volume]);

  const play = () => {
    if (audioRef.current && isLoaded) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error("Error playing audio:", error);
      });
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (level: number) => {
    if (audioRef.current) {
      const newVolume = Math.min(Math.max(level, 0), 1);
      audioRef.current.volume = newVolume;
    }
  };

  const syncStart = (targetTime = 0) => {
    if (audioRef.current && isLoaded) {
      audioRef.current.currentTime = targetTime;
      play();
    }
  };

  return {
    isPlaying,
    duration,
    currentTime,
    isLoaded,
    play,
    pause,
    toggle,
    seek,
    setVolume,
    syncStart,
  };
}
