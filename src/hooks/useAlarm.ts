import { useCallback, useRef } from 'react';
import { useSettingsStore } from '../stores/settingsStore';

export function useAlarm() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);

  const getContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  const playBeep = useCallback((volume: number) => {
    const ctx = getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.value = volume / 100;
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.2);
  }, [getContext]);

  const startAlarm = useCallback(() => {
    const { soundEnabled, volume } = useSettingsStore.getState();
    if (!soundEnabled) return;
    // Play immediately then every 500ms
    playBeep(volume);
    intervalRef.current = window.setInterval(() => {
      const { soundEnabled: s, volume: v } = useSettingsStore.getState();
      if (!s) { stopAlarm(); return; }
      playBeep(v);
    }, 500);
  }, [playBeep]);

  const stopAlarm = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  return { startAlarm, stopAlarm };
}
