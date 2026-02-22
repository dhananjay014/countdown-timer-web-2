import { memo } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { usePomodoroStore } from '../../stores/pomodoroStore';

const DEFAULT_CONFIG = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLong: 4,
  autoStartBreaks: false,
  autoStartWork: false,
};

export const PomodoroSettings = memo(function PomodoroSettings() {
  const status = usePomodoroStore((s) => s.status);
  const config = usePomodoroStore((s) => s.config);
  const setConfig = usePomodoroStore((s) => s.setConfig);

  const disabled = status !== 'idle';

  const handleNumberChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setConfig({ [field]: value });
    }
  };

  const handleSwitchChange = (field: string) => (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setConfig({ [field]: checked });
  };

  const handleResetDefaults = () => {
    setConfig(DEFAULT_CONFIG);
  };

  return (
    <Accordion sx={{ width: '100%', maxWidth: 480, mx: 'auto' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight={600}>Settings</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2.5}>
          <TextField
            label="Work duration (min)"
            type="number"
            value={config.workMinutes}
            onChange={handleNumberChange('workMinutes')}
            disabled={disabled}
            slotProps={{ htmlInput: { min: 1, max: 120 } }}
            size="small"
            fullWidth
          />
          <TextField
            label="Short break (min)"
            type="number"
            value={config.shortBreakMinutes}
            onChange={handleNumberChange('shortBreakMinutes')}
            disabled={disabled}
            slotProps={{ htmlInput: { min: 1, max: 60 } }}
            size="small"
            fullWidth
          />
          <TextField
            label="Long break (min)"
            type="number"
            value={config.longBreakMinutes}
            onChange={handleNumberChange('longBreakMinutes')}
            disabled={disabled}
            slotProps={{ htmlInput: { min: 1, max: 60 } }}
            size="small"
            fullWidth
          />
          <TextField
            label="Sessions before long break"
            type="number"
            value={config.sessionsBeforeLong}
            onChange={handleNumberChange('sessionsBeforeLong')}
            disabled={disabled}
            slotProps={{ htmlInput: { min: 1, max: 10 } }}
            size="small"
            fullWidth
          />
          <FormControlLabel
            control={
              <Switch
                checked={config.autoStartBreaks}
                onChange={handleSwitchChange('autoStartBreaks')}
                disabled={disabled}
              />
            }
            label="Auto-start breaks"
          />
          <FormControlLabel
            control={
              <Switch
                checked={config.autoStartWork}
                onChange={handleSwitchChange('autoStartWork')}
                disabled={disabled}
              />
            }
            label="Auto-start work"
          />
          <Button
            variant="outlined"
            onClick={handleResetDefaults}
            disabled={disabled}
            size="small"
          >
            Reset to defaults
          </Button>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
});
