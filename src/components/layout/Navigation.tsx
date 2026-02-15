import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TimerIcon from '@mui/icons-material/Timer';
import EventIcon from '@mui/icons-material/Event';
import Box from '@mui/material/Box';

interface NavigationProps {
  value: number;
  onChange: (value: number) => void;
}

export function Navigation({ value, onChange }: NavigationProps) {
  return (
    <Box sx={{
      borderBottom: 1,
      borderColor: 'divider',
      '& .MuiTabs-indicator': {
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      },
    }}>
      <Tabs value={value} onChange={(_, v) => onChange(v)} centered>
        <Tab icon={<TimerIcon />} label="Timers" iconPosition="start" />
        <Tab icon={<EventIcon />} label="Events" iconPosition="start" />
      </Tabs>
    </Box>
  );
}
