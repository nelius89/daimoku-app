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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    el.style.transform = `translate(${tilt.x}px, ${tilt.y}px)`;
  }, [tilt]);

  return (
    <div className="ab-wrapper">
      <div
        ref={containerRef}
        className={`ab-container ${isPaused ? 'ab-paused' : ''} ${reducedMotion ? 'ab-reduced' : ''}`}
      >
        <div className="ab-base" />
        <div className="ab-blob ab-blob-1" />
        <div className="ab-blob ab-blob-2" />
        <div className="ab-blob ab-blob-3" />
        <div className="ab-blob ab-blob-4" />
        <div className="ab-overlay" />
      </div>
    </div>
  );
}
