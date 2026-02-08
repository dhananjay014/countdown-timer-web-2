export const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map(val => String(val).padStart(2, '0'))
    .join(':');
};

export const formatEventRemaining = (targetDate: number): string => {
  const diff = targetDate - Date.now();
  if (diff <= 0) return 'Event passed';

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);

  if (hours < 24) return formatTime(totalSeconds);

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ${hours % 24}h`;
  if (days < 30) return `${days} days`;

  const months = Math.floor(days / 30);
  return `${months} months, ${days % 30} days`;
};

export const generateId = (): string => {
  return crypto.randomUUID();
};
