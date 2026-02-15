import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import Slider from '@mui/material/Slider';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useSettingsStore } from '../../stores/settingsStore';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const theme = useSettingsStore((s) => s.theme);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const volume = useSettingsStore((s) => s.volume);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const setSoundEnabled = useSettingsStore((s) => s.setSoundEnabled);
  const setVolume = useSettingsStore((s) => s.setVolume);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>Theme</Typography>
            <ToggleButtonGroup
              value={theme}
              exclusive
              onChange={(_, v) => v && setTheme(v)}
              fullWidth
              size="small"
            >
              <ToggleButton value="light"><LightModeIcon sx={{ mr: 1 }} />Light</ToggleButton>
              <ToggleButton value="system"><SettingsBrightnessIcon sx={{ mr: 1 }} />System</ToggleButton>
              <ToggleButton value="dark"><DarkModeIcon sx={{ mr: 1 }} />Dark</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle2">Sound</Typography>
              <Switch checked={soundEnabled} onChange={(e) => setSoundEnabled(e.target.checked)} />
            </Stack>
          </Box>
          <Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <VolumeUpIcon color={soundEnabled ? 'primary' : 'disabled'} />
              <Slider
                value={volume}
                onChange={(_, v) => setVolume(v as number)}
                min={0}
                max={100}
                disabled={!soundEnabled}
              />
              <Typography variant="body2" sx={{ minWidth: 30 }}>{volume}%</Typography>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
