import { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AlarmIcon from '@mui/icons-material/Alarm';
import { useTimersStore } from '../../stores/timersStore';
import { useAlarm } from '../../hooks/useAlarm';

export function AlarmOverlay() {
  const completedTimerIds = useTimersStore((s) => s.completedTimerIds);
  const timers = useTimersStore((s) => s.timers);
  const dismissAllAlarms = useTimersStore((s) => s.dismissAllAlarms);
  const resetTimer = useTimersStore((s) => s.resetTimer);
  const { startAlarm, stopAlarm } = useAlarm();

  const completedTimers = timers.filter((t) => completedTimerIds.includes(t.id));
  const isOpen = completedTimerIds.length > 0;

  useEffect(() => {
    if (isOpen) {
      startAlarm();
    }
    return () => stopAlarm();
  }, [isOpen, startAlarm, stopAlarm]);

  const handleDismiss = () => {
    stopAlarm();
    completedTimerIds.forEach((id) => resetTimer(id));
    dismissAllAlarms();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={handleDismiss} maxWidth="sm" fullWidth>
      <DialogContent>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <AlarmIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Time's Up!
          </Typography>
          {completedTimers.map((t) => (
            <Typography key={t.id} variant="h6" color="text.secondary">
              {t.label || 'Timer'}
            </Typography>
          ))}
          <Button variant="contained" size="large" onClick={handleDismiss} sx={{ mt: 4, px: 6 }}>
            Dismiss
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
