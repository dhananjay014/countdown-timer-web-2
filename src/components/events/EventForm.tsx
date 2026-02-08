import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { format } from 'date-fns';
import type { CountdownEvent } from '../../types';
import { useEventsStore } from '../../stores/eventsStore';

interface EventFormProps {
  open: boolean;
  event?: CountdownEvent | null;
  onClose: () => void;
}

export function EventForm({ open, event, onClose }: EventFormProps) {
  const { addEvent, updateEvent } = useEventsStore();
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    if (event) {
      setName(event.name);
      const d = new Date(event.targetDate);
      setDate(format(d, 'yyyy-MM-dd'));
      setTime(format(d, 'HH:mm'));
    } else {
      setName('');
      // Default to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(format(tomorrow, 'yyyy-MM-dd'));
      setTime('12:00');
    }
  }, [event, open]);

  const handleSave = () => {
    if (!name.trim() || !date) return;
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = (time || '00:00').split(':').map(Number);
    const targetDate = new Date(year, month - 1, day, hour, minute).getTime();
    if (event) {
      updateEvent(event.id, name.trim(), targetDate);
    } else {
      addEvent(name.trim(), targetDate);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{event ? 'Edit Event' : 'New Event'}</DialogTitle>
      <DialogContent>
        <TextField fullWidth label="Event Name" value={name} onChange={(e) => setName(e.target.value)} margin="normal" />
        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
          <TextField label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
          <TextField label="Time" type="time" value={time} onChange={(e) => setTime(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
