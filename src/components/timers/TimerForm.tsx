import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import type { Timer } from '../../types';
import { useTimersStore } from '../../stores/timersStore';

interface TimerFormProps {
  open: boolean;
  timer?: Timer | null;
  onClose: () => void;
}

export function TimerForm({ open, timer, onClose }: TimerFormProps) {
  const { addTimer, updateTimer } = useTimersStore();
  const [label, setLabel] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (timer) {
      setLabel(timer.label);
      setHours(timer.hours);
      setMinutes(timer.minutes);
      setSeconds(timer.seconds);
    } else {
      setLabel('');
      setHours(0);
      setMinutes(5);
      setSeconds(0);
    }
  }, [timer, open]);

  const handleSave = () => {
    const h = Math.max(0, Math.min(99, hours));
    const m = Math.max(0, Math.min(59, minutes));
    const s = Math.max(0, Math.min(59, seconds));
    if (h === 0 && m === 0 && s === 0) return;
    if (timer) {
      updateTimer(timer.id, label, h, m, s);
    } else {
      addTimer(label, h, m, s);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{timer ? 'Edit Timer' : 'New Timer'}</DialogTitle>
      <DialogContent>
        <TextField fullWidth label="Label" value={label} onChange={(e) => setLabel(e.target.value)} margin="normal" />
        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
          <TextField label="Hours" type="number" value={hours} onChange={(e) => setHours(parseInt(e.target.value) || 0)} inputProps={{ min: 0, max: 99 }} fullWidth />
          <TextField label="Minutes" type="number" value={minutes} onChange={(e) => setMinutes(parseInt(e.target.value) || 0)} inputProps={{ min: 0, max: 59 }} fullWidth />
          <TextField label="Seconds" type="number" value={seconds} onChange={(e) => setSeconds(parseInt(e.target.value) || 0)} inputProps={{ min: 0, max: 59 }} fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
