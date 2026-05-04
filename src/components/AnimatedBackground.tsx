import { useEffect, useRef } from 'react';
import { useDeviceTilt } from '../hooks/useDeviceTilt';
import { useReducedMotion } from '../hooks/useReducedMotion';
import './AnimatedBackground.css';

interface Props {
  isPaused?: boolean;
}

export function AnimatedBackground({ isPaused = false }: Props) {
  const reducedMotion = useReducedMotion();
  const tilt = useDeviceTilt(18, reducedMotion);
  const gooeyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gooeyRef.current) return;
    gooeyRef.current.style.transform = `translate(${tilt.x}px, ${tilt.y}px)`;
  }, [tilt]);

  return (
    <div className="ab-wrapper">
      <div
        ref={gooeyRef}
        className={`ab-gooey ${isPaused ? 'ab-paused' : ''} ${reducedMotion ? 'ab-reduced' : ''}`}
      >
        <div className="ab-blob ab-blob-1" />
        <div className="ab-blob ab-blob-2" />
        <div className="ab-blob ab-blob-3" />
        <div className="ab-blob ab-blob-4" />
      </div>
      <div className="ab-overlay" />
    </div>
  );
}
