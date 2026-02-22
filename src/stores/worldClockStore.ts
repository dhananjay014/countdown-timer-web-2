import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WorldClock } from '../types/worldClock';
import { generateId } from '../utils/timeCalculations';

const MAX_CLOCKS = 10;

interface WorldClockState {
  clocks: WorldClock[];
  addClock: (timezone: string, label: string) => void;
  removeClock: (id: string) => void;
  reorderClocks: (fromIndex: number, toIndex: number) => void;
}

export const useWorldClockStore = create<WorldClockState>()(
  persist(
    (set, get) => ({
      clocks: [],
      addClock: (timezone, label) => {
        const { clocks } = get();
        if (clocks.length >= MAX_CLOCKS) return;
        if (clocks.some(c => c.timezone === timezone)) return;
        set({ clocks: [...clocks, { id: generateId(), timezone, label }] });
      },
      removeClock: (id) => {
        set({ clocks: get().clocks.filter(c => c.id !== id) });
      },
      reorderClocks: (fromIndex, toIndex) => {
        const clocks = [...get().clocks];
        const [moved] = clocks.splice(fromIndex, 1);
        clocks.splice(toIndex, 0, moved);
        set({ clocks });
      },
    }),
    { name: 'world-clocks' }
  )
);
