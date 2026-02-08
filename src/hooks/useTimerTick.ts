import { useEffect } from 'react';
import { useTimersStore } from '../stores/timersStore';

const TICK_INTERVAL = 250;

export function useTimerTick() {
  const hasRunning = useTimersStore((s) => s.timers.some((t) => t.status === 'running'));
  const tickTimers = useTimersStore((s) => s.tickTimers);

  useEffect(() => {
    if (!hasRunning) return;
    const id = window.setInterval(tickTimers, TICK_INTERVAL);
    return () => clearInterval(id);
  }, [hasRunning, tickTimers]);
}
