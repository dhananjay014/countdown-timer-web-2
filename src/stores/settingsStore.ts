import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings } from '../types';
import { DEFAULT_SETTINGS } from '../utils/constants';

interface SettingsState extends Settings {
  setSoundEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundEnabled: DEFAULT_SETTINGS.soundEnabled,
      volume: DEFAULT_SETTINGS.volume,
      theme: DEFAULT_SETTINGS.theme,

      setSoundEnabled: (enabled) =>
        set(() => ({ soundEnabled: enabled })),

      setVolume: (volume) =>
        set(() => ({ volume: Math.max(0, Math.min(100, volume)) })),

      setTheme: (theme) =>
        set(() => ({ theme })),
    }),
    {
      name: 'countdown-settings',
    }
  )
);
