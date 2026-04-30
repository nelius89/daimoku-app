import { useState, useRef } from 'react';
import { DAIMOKU_DURATIONS } from '../constants/tracks';
import './DurationSelectorScreen.css';

interface Props {
  onStart: (duration: number) => void;
  onBack: () => void;
}

export function DurationSelectorScreen({ onStart, onBack }: Props) {
  const [selected, setSelected] = useState(10);
  const listRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = listRef.current;
    if (!el) return;
    const itemHeight = el.clientHeight / 3;
    const index = Math.round(el.scrollTop / itemHeight);
    const clamped = Math.max(0, Math.min(DAIMOKU_DURATIONS.length - 1, index));
    setSelected(DAIMOKU_DURATIONS[clamped]);
  };

  return (
    <div className="duration-screen">
      <button className="back-button" onClick={onBack} aria-label="Volver al inicio">
        <span>←</span>
      </button>

      <div className="duration-center">
        <div className="picker-wrapper">
          <div className="picker-fade picker-fade-top" />
          <div
            ref={listRef}
            className="picker-list"
            onScroll={handleScroll}
            role="listbox"
            aria-label="Duración del Daimoku"
          >
            {/* Spacer items for scroll snap centering */}
            <div className="picker-spacer" aria-hidden="true" />
            {DAIMOKU_DURATIONS.map((d) => (
              <div
                key={d}
                className={`picker-item ${d === selected ? 'picker-item-active' : ''}`}
                role="option"
                aria-selected={d === selected}
              >
                <span className="picker-number">{d}</span>
                <span className="picker-unit">min</span>
              </div>
            ))}
            <div className="picker-spacer" aria-hidden="true" />
          </div>
          <div className="picker-fade picker-fade-bottom" />
          <div className="picker-highlight" aria-hidden="true" />
        </div>
      </div>

      <div className="duration-bottom">
        <button
          className="play-button"
          onClick={() => onStart(selected)}
          aria-label="Comenzar práctica"
        >
          Comenzar
        </button>
      </div>
    </div>
  );
}
