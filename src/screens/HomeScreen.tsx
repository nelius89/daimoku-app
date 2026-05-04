import { useState } from 'react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import './HomeScreen.css';

interface Props {
  onLotusPress: () => void;
  onGongyoPress: () => void;
}

export function HomeScreen({ onLotusPress, onGongyoPress }: Props) {
  const { canInstall, isIOS, install } = useInstallPrompt();
  const [showIOSHint, setShowIOSHint] = useState(false);

  const handleInstall = () => {
    if (isIOS) {
      setShowIOSHint(true);
    } else {
      install();
    }
  };

  return (
    <div className="home-screen">
      {canInstall && (
        <div className="install-wrap">
          <button className="install-button" onClick={handleInstall} aria-label="Instalar app">
            + Añadir a inicio
          </button>
        </div>
      )}

      {showIOSHint && (
        <div className="ios-hint" onClick={() => setShowIOSHint(false)}>
          <div className="ios-hint-box">
            Pulsa <strong>Compartir</strong> y luego <strong>"Añadir a pantalla de inicio"</strong>
          </div>
        </div>
      )}

      <div className="home-center">
        <button
          className="lotus-button"
          onClick={onLotusPress}
          aria-label="Practicar Daimoku"
        >
          <img src="/loto.png" className="lotus-icon" alt="" aria-hidden="true" />
        </button>
      </div>

      <div className="home-bottom">
        <button
          className="gongyo-button"
          onClick={onGongyoPress}
          aria-label="Practicar Gongyo y Daimoku"
        >
          Gongyo + Daimoku
        </button>
      </div>
    </div>
  );
}
