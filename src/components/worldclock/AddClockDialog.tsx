import { memo, useState, useEffect, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { TIMEZONE_OPTIONS } from '../../utils/timezones';
import { formatTimeInZone, formatDateInZone, getUtcOffset } from '../../utils/timezoneFormat';
import { useWorldClockStore } from '../../stores/worldClockStore';

interface AddClockDialogProps {
  open: boolean;
  onClose: () => void;
}

type TimezoneOption = (typeof TIMEZONE_OPTIONS)[number];

export const AddClockDialog = memo(function AddClockDialog({ open, onClose }: AddClockDialogProps) {
  const clocks = useWorldClockStore((s) => s.clocks);
  const addClock = useWorldClockStore((s) => s.addClock);

  const [selected, setSelected] = useState<TimezoneOption | null>(null);
  const [, setTick] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tick every second to update preview — driven by setTick forcing re-render
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!selected) return;
    intervalRef.current = setInterval(() => setTick(t => t + 1), 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [selected]);

  // Derive preview from current state (no effect needed)
  const preview = selected
    ? `${formatTimeInZone(selected.timezone)} - ${formatDateInZone(selected.timezone)} (${getUtcOffset(selected.timezone)})`
    : '';

  const isDuplicate = selected ? clocks.some(c => c.timezone === selected.timezone) : false;
  const isDisabled = !selected || isDuplicate;

  const handleAdd = () => {
    if (selected && !isDuplicate) {
      addClock(selected.timezone, selected.label);
      setSelected(null);
      onClose();
    }
  };

  const handleClose = () => {
    setSelected(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add World Clock</DialogTitle>
      <DialogContent>
        <Autocomplete
          options={[...TIMEZONE_OPTIONS]}
          getOptionLabel={(option) => `${option.label} (${option.timezone})`}
          filterOptions={(options, { inputValue }) => {
            const lower = inputValue.toLowerCase();
            return options.filter(
              (o) =>
                o.label.toLowerCase().includes(lower) ||
                o.timezone.toLowerCase().includes(lower)
            );
          }}
          value={selected}
          onChange={(_event, value) => setSelected(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search timezone"
              placeholder="Start typing a city name..."
              sx={{ mt: 1 }}
              autoFocus
            />
          )}
          isOptionEqualToValue={(option, value) => option.timezone === value.timezone}
        />
        {selected && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body1" fontFamily="monospace" fontWeight={600}>
              {preview}
            </Typography>
            {isDuplicate && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                This timezone is already added.
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={isDisabled}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
});
