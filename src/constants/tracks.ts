export type Practice = 'daimoku' | 'gongyo_daimoku';

export interface Track {
  id: string;
  practice: Practice;
  durationMinutes: number | null;
  label: string;
  file: string;
}

export const TRACKS: Record<string, Track> = {
  daimoku_10: {
    id: 'daimoku_10',
    practice: 'daimoku',
    durationMinutes: 10,
    label: 'Daimoku · 10 min',
    file: '/audio/daimoku_10.mp3',
  },
  daimoku_15: {
    id: 'daimoku_15',
    practice: 'daimoku',
    durationMinutes: 15,
    label: 'Daimoku · 15 min',
    file: '/audio/daimoku_15.mp3',
  },
  daimoku_20: {
    id: 'daimoku_20',
    practice: 'daimoku',
    durationMinutes: 20,
    label: 'Daimoku · 20 min',
    file: '/audio/daimoku_20.mp3',
  },
  daimoku_30: {
    id: 'daimoku_30',
    practice: 'daimoku',
    durationMinutes: 30,
    label: 'Daimoku · 30 min',
    file: '/audio/daimoku_30.mp3',
  },
  gongyo_daimoku: {
    id: 'gongyo_daimoku',
    practice: 'gongyo_daimoku',
    durationMinutes: null,
    label: 'Gongyo + Daimoku',
    file: '/audio/gongyo_daimoku.mp3',
  },
};

export const DAIMOKU_DURATIONS = [10, 15, 20, 30];

export function getTrackForDuration(minutes: number): Track {
  return TRACKS[`daimoku_${minutes}`];
}
