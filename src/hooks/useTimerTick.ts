import { useEffect } from 'react';
import { useTimersStore } from '../stores/timersStore';

const TICK_INTERVAL = 250;

const selectHasRunning = (s: ReturnType<typeof useTimersStore.getState>) =>
  s.timers.some((t) => t.status === 'running');

const selectTickTimers = (s: ReturnType<typeof useTimersStore.getState>) => s.tickTimers;

export function useTimerTick() {
  const hasRunning = useTimersStore(selectHasRunning);
  const tickTimers = useTimersStore(selectTickTimers);

  useEffect(() => {
    if (!hasRunning) return;
    const id = window.setInterval(tickTimers, TICK_INTERVAL);
    return () => clearInterval(id);
  }, [hasRunning, tickTimers]);
}
