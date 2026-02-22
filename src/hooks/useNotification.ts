import { useCallback, useRef, useEffect } from 'react';
import { useSettingsStore } from '../stores/settingsStore';
import { useTimersStore } from '../stores/timersStore';

export function useNotification() {
  const prevCompletedRef = useRef<string[]>([]);
  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);
  const completedTimerIds = useTimersStore((s) => s.completedTimerIds);
  const timers = useTimersStore((s) => s.timers);

  const sendNotification = useCallback((title: string, body: string) => {
    if (!notificationsEnabled || Notification.permission !== 'granted') return;
    try {
      new Notification(title, {
        body,
        icon: '/favicon.svg',
        tag: 'timer-complete',
      });
    } catch {
      // Notification may fail in some environments
    }
  }, [notificationsEnabled]);

  // Watch for newly completed timers and send notifications
  useEffect(() => {
    const prev = prevCompletedRef.current;
    const newIds = completedTimerIds.filter((id) => !prev.includes(id));

    if (newIds.length > 0 && document.hidden) {
      const names = newIds
        .map((id) => timers.find((t) => t.id === id)?.label || 'Timer')
        .join(', ');
      sendNotification(
        "Time's Up!",
        newIds.length === 1 ? `${names} has completed` : `${names} have completed`
      );
    }

    prevCompletedRef.current = completedTimerIds;
  }, [completedTimerIds, timers, sendNotification]);
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}
