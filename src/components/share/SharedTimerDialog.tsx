import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { decodeTimerUrl } from '../../utils/shareUrl';
import { formatTime } from '../../utils/timeCalculations';
import { useTimersStore } from '../../stores/timersStore';

export function SharedTimerDialog() {
  const location = useLocation();
  const navigate = useNavigate();
  const addTimer = useTimersStore((s) => s.addTimer);
  const startTimer = useTimersStore((s) => s.startTimer);
  const timers = useTimersStore((s) => s.timers);

  const parsed = useMemo(() => decodeTimerUrl(location.search), [location.search]);

  const handleStart = () => {
    if (!parsed) return;
    const hours = Math.floor(parsed.durationSeconds / 3600);
    const minutes = Math.floor((parsed.durationSeconds % 3600) / 60);
    const seconds = parsed.durationSeconds % 60;
    addTimer(parsed.label, hours, minutes, seconds);
    // The newly added timer is the last one in the array
    const currentTimers = useTimersStore.getState().timers;
    const newTimer = currentTimers[currentTimers.length - 1];
    if (newTimer) {
      startTimer(newTimer.id);
    }
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (!parsed) {
    return (
      <Dialog open onClose={handleCancel}>
        <DialogTitle>Invalid Share Link</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This timer share link is invalid or missing required parameters.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleCancel}>Go Home</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open onClose={handleCancel}>
      <DialogTitle>Shared Timer</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>{parsed.label}</strong>
        </Typography>
        <Typography variant="h5" fontFamily="monospace" fontWeight={700}>
          {formatTime(parsed.durationSeconds)}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button variant="contained" onClick={handleStart}>Start Timer</Button>
      </DialogActions>
    </Dialog>
  );
}
