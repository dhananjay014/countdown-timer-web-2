import { create } from 'zustand';

interface EmbedTimerState {
  label: string;
  totalSeconds: number;
  remainingTime: number;
  endTime: number | null;
  status: 'idle' | 'running' | 'paused' | 'completed';
  init: (label: string, totalSeconds: number) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;
}

export const useEmbedTimerStore = create<EmbedTimerState>()((set, get) => ({
  label: '',
  totalSeconds: 0,
  remainingTime: 0,
  endTime: null,
  status: 'idle',
  init: (label, totalSeconds) => set({
    label,
    totalSeconds,
    remainingTime: totalSeconds,
    endTime: null,
    status: 'idle',
  }),
  start: () => {
    const { remainingTime } = get();
    set({ status: 'running', endTime: Date.now() + remainingTime * 1000 });
  },
  pause: () => {
    const { endTime } = get();
    if (!endTime) return;
    const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    set({ status: 'paused', remainingTime: remaining, endTime: null });
  },
  reset: () => {
    const { totalSeconds } = get();
    set({ status: 'idle', remainingTime: totalSeconds, endTime: null });
  },
  tick: () => {
    const { endTime, status } = get();
    if (status !== 'running' || !endTime) return;
    const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    if (remaining <= 0) {
      set({ remainingTime: 0, endTime: null, status: 'completed' });
    } else {
      set({ remainingTime: remaining });
    }
  },
}));
