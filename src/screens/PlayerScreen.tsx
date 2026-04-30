import { useEffect, useCallback } from 'react';
import type { Track } from '../constants/tracks';
import { useAudio } from '../hooks/useAudio';
import './PlayerScreen.css';

interface Props {
  track: Track;
  onBack: () => void;
  onComplete: () => void;
  onPauseChange?: (paused: boolean) => void;
}

export function PlayerScreen({ track, onBack, onComplete, onPauseChange }: Props) {
  const { isPlaying, isEnded, currentTime, duration, load, play, pause, stop } = useAudio();

  useEffect(() => {
    load(track.file);
    play();
    return () => { stop(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track.file]);

  useEffect(() => {
    if (isEnded) {
      const timer = setTimeout(onComplete, 2500);
      return () => clearTimeout(timer);
    }
  }, [isEnded, onComplete]);

  const handlePause = useCallback(() => {
    pause();
    onPauseChange?.(true);
  }, [pause, onPauseChange]);

  const handlePlay = useCallback(() => {
    play();
    onPauseChange?.(false);
  }, [play, onPauseChange]);

  const handleBack = () => {
    stop();
    onBack();
  };

  const progress = duration > 0 ? currentTime / duration : 0;

  const formatTime = (s: number) => {
    if (!isFinite(s) || s < 0) return '—';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const remaining = duration > 0 ? duration - currentTime : 0;

  return (
    <div className="player-screen">
      <button className="player-back" onClick={handleBack} aria-label="Volver al inicio">
        <span>←</span>
      </button>

      <div className="player-center">
        <div className={`player-lotus-wrap ${isEnded ? 'player-ended' : ''}`}>
          <span className="player-lotus" role="img" aria-label="loto">🪷</span>
        </div>

        <div className="player-label">
          {track.practice === 'daimoku'
            ? `Daimoku · ${track.durationMinutes} min`
            : 'Gongyo + Daimoku'}
        </div>

        {isEnded && (
          <div className="player-complete-text">Finalizado</div>
        )}
      </div>

      {/* Subtle progress ring — non-interactive */}
      {!isEnded && duration > 0 && (
        <div className="player-progress-wrap" aria-hidden="true">
          <svg className="player-progress-svg" viewBox="0 0 100 100">
            <circle
              className="player-progress-track"
              cx="50" cy="50" r="44"
              fill="none"
              strokeWidth="1"
            />
            <circle
              className="player-progress-fill"
              cx="50" cy="50" r="44"
              fill="none"
              strokeWidth="1"
              strokeDasharray={`${2 * Math.PI * 44}`}
              strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress)}`}
            />
          </svg>
          <div className="player-remaining">{formatTime(remaining)}</div>
        </div>
      )}

      {!isEnded && (
        <div className="player-controls">
          <button
            className="player-pause-btn"
            onClick={isPlaying ? handlePause : handlePlay}
            aria-label={isPlaying ? 'Pausar práctica' : 'Reanudar práctica'}
          >
            {isPlaying ? (
              <span className="player-icon player-icon-pause">
                <span /><span />
              </span>
            ) : (
              <span className="player-icon player-icon-play">▶</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
