import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { decodeEventUrl } from '../../utils/shareUrl';
import { formatDateDisplay } from '../../utils/dateFormat';
import { useEventsStore } from '../../stores/eventsStore';

export function SharedEventDialog() {
  const location = useLocation();
  const navigate = useNavigate();
  const addEvent = useEventsStore((s) => s.addEvent);

  const parsed = useMemo(() => decodeEventUrl(location.search), [location.search]);
  const isPast = parsed ? parsed.targetDate <= Date.now() : false;

  const handleAdd = () => {
    if (!parsed) return;
    addEvent(parsed.name, parsed.targetDate);
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
            This event share link is invalid or missing required parameters.
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
      <DialogTitle>Shared Event</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>{parsed.name}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formatDateDisplay(parsed.targetDate)}
        </Typography>
        {isPast && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            This event date is in the past.
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button variant="contained" onClick={handleAdd}>Add Event</Button>
      </DialogActions>
    </Dialog>
  );
}
