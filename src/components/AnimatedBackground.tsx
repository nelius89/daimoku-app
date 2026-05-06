import { useEffect, useRef } from 'react';
import { useDeviceTilt } from '../hooks/useDeviceTilt';
import { useReducedMotion } from '../hooks/useReducedMotion';
import './AnimatedBackground.css';

interface Props {
  isPaused?: boolean;
}

export function AnimatedBackground({ isPaused = false }: Props) {
  const reducedMotion = useReducedMotion();
  const tilt = useDeviceTilt(30, reducedMotion);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;
    wrapperRef.current.style.setProperty('--tx', `${tilt.x}px`);
    wrapperRef.current.style.setProperty('--ty', `${tilt.y}px`);
  }, [tilt]);

  return (
    <div ref={wrapperRef} className="ab-wrapper">
      <div className={`ab-gooey ${isPaused ? 'ab-paused' : ''} ${reducedMotion ? 'ab-reduced' : ''}`}>
        <div className="ab-blob ab-blob-1" />
        <div className="ab-blob ab-blob-2" />
        <div className="ab-blob ab-blob-3" />
        <div className="ab-blob ab-blob-4" />
      </div>
      <div className="ab-overlay" />
    </div>
  );
}
