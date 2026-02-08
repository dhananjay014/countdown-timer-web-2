import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';

interface AppBarProps {
  onOpenSettings: () => void;
}

export function AppBar({ onOpenSettings }: AppBarProps) {
  return (
    <MuiAppBar position="static" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Countdown Timer
        </Typography>
        <IconButton onClick={onOpenSettings} aria-label="settings">
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </MuiAppBar>
  );
}
