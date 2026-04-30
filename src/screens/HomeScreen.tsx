import './HomeScreen.css';

interface Props {
  onLotusPress: () => void;
  onGongyoPress: () => void;
}

export function HomeScreen({ onLotusPress, onGongyoPress }: Props) {
  return (
    <div className="home-screen">
      <div className="home-center">
        <button
          className="lotus-button"
          onClick={onLotusPress}
          aria-label="Practicar Daimoku"
        >
          <span className="lotus-emoji" role="img" aria-hidden="true">🪷</span>
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
