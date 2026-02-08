import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { AppBar } from './AppBar';
import { Navigation } from './Navigation';

interface AppLayoutProps {
  children: React.ReactNode;
  tab: number;
  onTabChange: (value: number) => void;
  onOpenSettings: () => void;
}

export function AppLayout({ children, tab, onTabChange, onOpenSettings }: AppLayoutProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar onOpenSettings={onOpenSettings} />
      <Navigation value={tab} onChange={onTabChange} />
      <Container maxWidth="lg" sx={{ flex: 1, py: 3 }}>
        {children}
      </Container>
    </Box>
  );
}
