import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { AppBar } from './AppBar';
import { Navigation } from './Navigation';
import { SettingsDialog } from '../settings/SettingsDialog';

interface AppLayoutProps {
  children: React.ReactNode;
  tab: number;
  onTabChange: (value: number) => void;
  onOpenSettings: () => void;
  settingsOpen: boolean;
  onCloseSettings: () => void;
}

export function AppLayout({ children, tab, onTabChange, onOpenSettings, settingsOpen, onCloseSettings }: AppLayoutProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar onOpenSettings={onOpenSettings} />
      <Navigation value={tab} onChange={onTabChange} />
      <Container maxWidth="lg" sx={{ flex: 1, py: 3 }}>
        {children}
      </Container>
      <SettingsDialog open={settingsOpen} onClose={onCloseSettings} />
    </Box>
  );
}
