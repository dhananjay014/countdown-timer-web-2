import { useSyncExternalStore } from 'react';

let tick = 0;
const listeners: Set<() => void> = new Set();
let intervalId: number | null = null;

function startTicking() {
  if (intervalId !== null) return;
  intervalId = window.setInterval(() => {
    tick++;
    listeners.forEach((l) => l());
  }, 1000);
}

function stopTicking() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) startTicking();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) stopTicking();
  };
}

function getSnapshot() {
  return tick;
}

export function useEventTick(): number {
  return useSyncExternalStore(subscribe, getSnapshot);
}
