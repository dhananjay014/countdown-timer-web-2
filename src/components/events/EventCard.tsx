import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { format } from 'date-fns';
import type { CountdownEvent } from '../../types';
import { useEventsStore } from '../../stores/eventsStore';
import { formatEventRemaining } from '../../utils/timeCalculations';

interface EventCardProps {
  event: CountdownEvent;
  onEdit: (event: CountdownEvent) => void;
}

export function EventCard({ event, onEdit }: EventCardProps) {
  const deleteEvent = useEventsStore((s) => s.deleteEvent);
  const [remaining, setRemaining] = useState(() => formatEventRemaining(event.targetDate));
  const isPast = event.targetDate <= Date.now();

  useEffect(() => {
    setRemaining(formatEventRemaining(event.targetDate));
    if (isPast) return;
    const id = window.setInterval(() => {
      setRemaining(formatEventRemaining(event.targetDate));
    }, 1000);
    return () => clearInterval(id);
  }, [event.targetDate, isPast]);

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={600}>{event.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {format(new Date(event.targetDate), 'PPP p')}
            </Typography>
            <Typography variant="h4" fontFamily="monospace" fontWeight={700} sx={{ mt: 1 }} color={isPast ? 'text.secondary' : 'primary.main'}>
              {remaining}
            </Typography>
            {isPast && <Chip label="Completed" size="small" color="success" sx={{ mt: 1 }} />}
          </Box>
          <Stack direction="row">
            <IconButton size="small" onClick={() => onEdit(event)}><EditIcon fontSize="small" /></IconButton>
            <IconButton size="small" color="error" onClick={() => deleteEvent(event.id)}><DeleteIcon fontSize="small" /></IconButton>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
