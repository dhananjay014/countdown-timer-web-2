import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import type { CountdownEvent } from '../../types';
import { useEventsStore } from '../../stores/eventsStore';
import { toDateInputValue, toTimeInputValue } from '../../utils/dateFormat';

interface EventFormProps {
  open: boolean;
  event?: CountdownEvent | null;
  onClose: () => void;
}

function getDefaults(event: CountdownEvent | null | undefined) {
  if (event) {
    const d = new Date(event.targetDate);
    return { name: event.name, date: toDateInputValue(d), time: toTimeInputValue(d) };
  }
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return { name: '', date: toDateInputValue(tomorrow), time: '12:00' };
}

export function EventForm({ open, event, onClose }: EventFormProps) {
  const { addEvent, updateEvent } = useEventsStore();
  const defaults = getDefaults(event);
  const [name, setName] = useState(defaults.name);
  const [date, setDate] = useState(defaults.date);
  const [time, setTime] = useState(defaults.time);

  // Reset form when dialog opens with new data
  const [prevKey, setPrevKey] = useState<string | null>(null);
  const key = open ? (event?.id ?? '__new__') : null;
  if (key !== prevKey) {
    setPrevKey(key);
    if (key !== null) {
      const d = getDefaults(event);
      setName(d.name);
      setDate(d.date);
      setTime(d.time);
    }
  }

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
          <TextField label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} fullWidth slotProps={{ inputLabel: { shrink: true } }} />
          <TextField label="Time" type="time" value={time} onChange={(e) => setTime(e.target.value)} fullWidth slotProps={{ inputLabel: { shrink: true } }} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
