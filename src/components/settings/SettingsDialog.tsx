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
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useSettingsStore } from '../../stores/settingsStore';
import { requestNotificationPermission } from '../../hooks/useNotification';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const theme = useSettingsStore((s) => s.theme);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const volume = useSettingsStore((s) => s.volume);
  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const setSoundEnabled = useSettingsStore((s) => s.setSoundEnabled);
  const setVolume = useSettingsStore((s) => s.setVolume);
  const setNotificationsEnabled = useSettingsStore((s) => s.setNotificationsEnabled);

  const handleNotificationToggle = async (checked: boolean) => {
    if (checked) {
      const granted = await requestNotificationPermission();
      setNotificationsEnabled(granted);
    } else {
      setNotificationsEnabled(false);
    }
  };

  const notificationsDenied = 'Notification' in window && Notification.permission === 'denied';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth aria-labelledby="settings-dialog-title">
      <DialogTitle id="settings-dialog-title">Settings</DialogTitle>
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
              <Switch checked={soundEnabled} onChange={(e) => setSoundEnabled(e.target.checked)} slotProps={{ input: { 'aria-label': 'Enable sound' } }} />
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
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center">
                <NotificationsIcon color={notificationsEnabled ? 'primary' : 'disabled'} fontSize="small" />
                <Box>
                  <Typography variant="subtitle2">Browser Notifications</Typography>
                  {notificationsDenied && (
                    <Typography variant="caption" color="error">
                      Blocked by browser. Reset in site settings.
                    </Typography>
                  )}
                </Box>
              </Stack>
              <Switch
                checked={notificationsEnabled}
                onChange={(e) => handleNotificationToggle(e.target.checked)}
                disabled={notificationsDenied}
                slotProps={{ input: { 'aria-label': 'Enable browser notifications' } }}
              />
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
