import { useState, useCallback } from 'react';
import { AnimatedBackground } from './components/AnimatedBackground';
import { HomeScreen } from './screens/HomeScreen';
import { DurationSelectorScreen } from './screens/DurationSelectorScreen';
import { PlayerScreen } from './screens/PlayerScreen';
import { TRACKS, getTrackForDuration } from './constants/tracks';
import type { Track } from './constants/tracks';
import './App.css';

type Screen = 'HOME' | 'DURATION_SELECTOR' | 'PLAYER';

function App() {
  const [screen, setScreen] = useState<Screen>('HOME');
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlayerPaused, setIsPlayerPaused] = useState(false);

  const goHome = useCallback(() => {
    setScreen('HOME');
    setCurrentTrack(null);
    setIsPlayerPaused(false);
  }, []);

  const openDurationSelector = useCallback(() => {
    setScreen('DURATION_SELECTOR');
  }, []);

  const startGongyo = useCallback(() => {
    setCurrentTrack(TRACKS.gongyo_daimoku);
    setScreen('PLAYER');
    setIsPlayerPaused(false);
  }, []);

  const startDaimoku = useCallback((minutes: number) => {
    setCurrentTrack(getTrackForDuration(minutes));
    setScreen('PLAYER');
    setIsPlayerPaused(false);
  }, []);

  const handlePlayerPause = useCallback((paused: boolean) => {
    setIsPlayerPaused(paused);
  }, []);

  return (
    <div className="app">
      <AnimatedBackground isPaused={isPlayerPaused} />

      <div className="screen-container">
        {screen === 'HOME' && (
          <HomeScreen
            onLotusPress={openDurationSelector}
            onGongyoPress={startGongyo}
          />
        )}

        {screen === 'DURATION_SELECTOR' && (
          <DurationSelectorScreen
            onStart={startDaimoku}
            onBack={goHome}
          />
        )}

        {screen === 'PLAYER' && currentTrack && (
          <PlayerScreen
            track={currentTrack}
            onBack={goHome}
            onComplete={goHome}
            onPauseChange={handlePlayerPause}
          />
        )}
      </div>
    </div>
  );
}

export default App;
