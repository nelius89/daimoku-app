import { useState, useRef, useEffect, useCallback } from 'react';

interface UseAudioReturn {
  isPlaying: boolean;
  isEnded: boolean;
  currentTime: number;
  duration: number;
  play: () => void;
  pause: () => void;
  stop: () => void;
  load: (src: string) => void;
}

export function useAudio(): UseAudioReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const ensureAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    return audioRef.current;
  }, []);

  const load = useCallback((src: string) => {
    const audio = ensureAudio();
    audio.pause();
    audio.src = src;
    audio.currentTime = 0;
    setIsPlaying(false);
    setIsEnded(false);
    setCurrentTime(0);
    setDuration(0);
  }, [ensureAudio]);

  const play = useCallback(() => {
    const audio = ensureAudio();
    audio.play().then(() => setIsPlaying(true)).catch(() => {});
  }, [ensureAudio]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setIsEnded(false);
    setCurrentTime(0);
  }, []);

  useEffect(() => {
    const audio = ensureAudio();

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      setIsPlaying(false);
      setIsEnded(true);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
    };
  }, [ensureAudio]);

  return { isPlaying, isEnded, currentTime, duration, play, pause, stop, load };
}
