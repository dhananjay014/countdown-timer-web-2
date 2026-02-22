import { useEffect } from 'react';
import { usePomodoroStore } from '../stores/pomodoroStore';

const TICK_INTERVAL = 250;

export function usePomodoroTick() {
  const status = usePomodoroStore((s) => s.status);
  const tick = usePomodoroStore((s) => s.tick);

  useEffect(() => {
    if (status !== 'running') return;
    const id = window.setInterval(tick, TICK_INTERVAL);
    return () => clearInterval(id);
  }, [status, tick]);
}
