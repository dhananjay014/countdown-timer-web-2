import { memo, useState, useCallback, useMemo } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import type { CountdownEvent } from '../../types';
import { useEventsStore } from '../../stores/eventsStore';
import { formatEventRemaining } from '../../utils/timeCalculations';
import { encodeEventUrl } from '../../utils/shareUrl';
import { useEventTick } from '../../hooks/useEventTick';
import { formatDateDisplay } from '../../utils/dateFormat';

interface EventCardProps {
  event: CountdownEvent;
  onEdit: (event: CountdownEvent) => void;
}

export const EventCard = memo(function EventCard({ event, onEdit }: EventCardProps) {
  const deleteEvent = useEventsStore((s) => s.deleteEvent);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);

  const handleShare = useCallback(() => {
    const url = encodeEventUrl(event.name, event.targetDate);
    navigator.clipboard.writeText(url).then(() => setSnackOpen(true));
  }, [event.name, event.targetDate]);

  // Single shared tick drives all event cards - no per-card interval
  const tick = useEventTick();

  const { isPast, remaining } = useMemo(() => {
    const now = Date.now();
    return {
      isPast: event.targetDate <= now,
      remaining: formatEventRemaining(event.targetDate),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.targetDate, tick]);

  return (
    <>
      <Card sx={{
        transition: 'box-shadow 0.3s ease, transform 0.2s ease',
        '&:hover': { boxShadow: 6, transform: 'translateY(-2px)' },
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight={600} noWrap>{event.name || 'Event'}</Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDateDisplay(event.targetDate)}
              </Typography>
              <Typography variant="h4" fontFamily="monospace" fontWeight={700} sx={{ mt: 1 }} color={isPast ? 'text.secondary' : 'primary.main'}>
                {remaining}
              </Typography>
              {isPast && <Chip label="Completed" size="small" color="success" sx={{ mt: 1 }} />}
            </Box>
            <Stack direction="row">
              <IconButton size="small" onClick={() => onEdit(event)} aria-label="Edit event"><EditIcon fontSize="small" /></IconButton>
              <IconButton size="small" onClick={handleShare} aria-label="Share event"><ShareIcon fontSize="small" /></IconButton>
              <IconButton size="small" color="error" onClick={() => setConfirmOpen(true)} aria-label="Delete event"><DeleteIcon fontSize="small" /></IconButton>
            </Stack>
          </Box>
        </CardContent>
      </Card>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{event.name || 'Event'}"? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => { deleteEvent(event.id); setConfirmOpen(false); }}>Delete</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackOpen}
        autoHideDuration={2000}
        onClose={() => setSnackOpen(false)}
        message="Link copied!"
      />
    </>
  );
});
