
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
  
  // Добавим debug-логи для отслеживания проблем с аудио
  const addTrack = (character: Character) => {
    console.log('Adding track for character:', character.name, 'with audio:', character.audioTrack);
    
    if (tracks.some(track => track.character.id === character.id)) {
      console.log('Track already exists for this character, skipping');
      return;
    }
    
    const audio = new Audio(character.audioTrack);
    audio.loop = true;
    
    // Добавим обработчики для отладки
    audio.addEventListener('error', (e) => {
      console.error('Audio error for', character.name, ':', e);
    });
    
    audio.addEventListener('canplaythrough', () => {
      console.log('Audio loaded and can play through for', character.name);
    });
    
    audio.addEventListener('loadedmetadata', () => {
      console.log('Audio metadata loaded for', character.name, 'duration:', audio.duration);
      
      // Если это первый трек, устанавливаем длину цикла
      if (loopLengthRef.current === 0) {
        loopLengthRef.current = audio.duration;
        console.log('Set loop length to', loopLengthRef.current);
      }
      
      setTracks(prev => [
        ...prev, 
        { character, audio, isPlaying: false }
      ]);
      
      // Если у нас уже есть воспроизводящиеся треки, синхронизируем этот
      if (tracks.some(t => t.isPlaying)) {
        const currentTime = (performance.now() - startTimeRef.current) / 1000 % loopLengthRef.current;
        audio.currentTime = currentTime;
        audio.play().catch(err => console.error('Error playing audio:', err));
      }
    });
  };
  
  // Удаление трека
  const removeTrack = (characterId: string) => {
    console.log('Removing track for character ID:', characterId);
    
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
  
  // Запуск всех треков синхронно
  const startAll = () => {
    console.log('Starting all tracks, count:', tracks.length);
    
    if (!tracks.length) {
      console.warn('No tracks to play');
      return;
    }
    
    // Сбрасываем время цикла и устанавливаем ссылку на время начала
    cycleTimeRef.current = 0;
    startTimeRef.current = performance.now();
    
    // Запускаем все треки с начала
    const playPromises = tracks.map(track => {
      console.log('Starting track for', track.character.name);
      track.audio.currentTime = 0;
      return track.audio.play().catch(err => {
        console.error('Error playing', track.character.name, ':', err);
      });
    });
    
    // Обновляем состояние треков, чтобы отразить, что они воспроизводятся
    setTracks(prev => 
      prev.map(track => ({ ...track, isPlaying: true }))
    );
    
    // Запускаем анимационный фрейм для отслеживания времени цикла
    const animate = (time: number) => {
      cycleTimeRef.current = (time - startTimeRef.current) / 1000 % loopLengthRef.current;
      rafIdRef.current = requestAnimationFrame(animate);
    };
    
    rafIdRef.current = requestAnimationFrame(animate);
    
    // Проверка статуса после запуска
    Promise.all(playPromises).then(() => {
      console.log('All tracks started successfully');
    }).catch(err => {
      console.error('Error starting tracks:', err);
    });
  };
  
  // Остановка всех треков
  const stopAll = () => {
    console.log('Stopping all tracks');
    
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
  
  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      console.log('Cleaning up audio synchronizer');
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      tracks.forEach(track => {
        track.audio.pause();
        track.audio.src = '';
      });
    };
  }, [tracks]);
  
  // Автоматическое воспроизведение аудио по взаимодействию пользователя (необходимо для многих браузеров)
  useEffect(() => {
    const resumeAudio = () => {
      console.log('User interaction detected, resuming audio context if needed');
      // Некоторые браузеры требуют взаимодействия пользователя для воспроизведения аудио
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      // После получения разрешения убираем слушатель
      document.removeEventListener('click', resumeAudio);
      document.removeEventListener('touchstart', resumeAudio);
    };
    
    document.addEventListener('click', resumeAudio);
    document.addEventListener('touchstart', resumeAudio);
    
    return () => {
      document.removeEventListener('click', resumeAudio);
      document.removeEventListener('touchstart', resumeAudio);
    };
  }, []);
  
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
