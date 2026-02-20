export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface Timer {
  id: string;
  label: string;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  remainingTime: number;
  endTime: number | null;
  status: TimerStatus;
  createdAt: number;
}

export interface CountdownEvent {
  id: string;
  name: string;
  targetDate: number;
  createdAt: number;
}

export interface Settings {
  soundEnabled: boolean;
  volume: number;
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
}

export type StopwatchStatus = 'idle' | 'running' | 'paused';

export interface Lap {
  id: number;
  time: number; // lap split time in ms
  total: number; // cumulative time in ms
}
