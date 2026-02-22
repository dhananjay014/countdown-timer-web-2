import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TimerIcon from '@mui/icons-material/Timer';
import { useTimersStore } from '../../stores/timersStore';
import { MAX_TIMERS } from '../../utils/constants';

const PRESETS = [
  { label: '1 min', hours: 0, minutes: 1, seconds: 0 },
  { label: '5 min', hours: 0, minutes: 5, seconds: 0 },
  { label: '10 min', hours: 0, minutes: 10, seconds: 0 },
  { label: '15 min', hours: 0, minutes: 15, seconds: 0 },
  { label: '25 min', hours: 0, minutes: 25, seconds: 0 },
  { label: '30 min', hours: 0, minutes: 30, seconds: 0 },
  { label: '45 min', hours: 0, minutes: 45, seconds: 0 },
  { label: '1 hour', hours: 1, minutes: 0, seconds: 0 },
] as const;

export function TimerPresets() {
  const addTimer = useTimersStore((s) => s.addTimer);
  const startTimer = useTimersStore((s) => s.startTimer);
  const timers = useTimersStore((s) => s.timers);

  const handlePreset = (preset: typeof PRESETS[number]) => {
    addTimer(preset.label, preset.hours, preset.minutes, preset.seconds);
    // Start the newly added timer (it will be the last one)
    const updatedTimers = useTimersStore.getState().timers;
    const newTimer = updatedTimers[updatedTimers.length - 1];
    if (newTimer) {
      startTimer(newTimer.id);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <TimerIcon fontSize="small" />
        Quick Start
      </Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
        {PRESETS.map((preset) => (
          <Chip
            key={preset.label}
            label={preset.label}
            onClick={() => handlePreset(preset)}
            variant="outlined"
            color="primary"
            disabled={timers.length >= MAX_TIMERS}
            sx={{
              fontWeight: 500,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                transform: 'scale(1.05)',
              },
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}
