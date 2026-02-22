import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TimerIcon from '@mui/icons-material/Timer';
import EventIcon from '@mui/icons-material/Event';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import LanguageIcon from '@mui/icons-material/Language';
import AvTimerIcon from '@mui/icons-material/AvTimer';
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
      <Tabs value={value} onChange={(_, v) => onChange(v)} centered variant="scrollable" scrollButtons="auto">
        <Tab icon={<TimerIcon />} label="Timers" iconPosition="start" />
        <Tab icon={<EventIcon />} label="Events" iconPosition="start" />
        <Tab icon={<SelfImprovementIcon />} label="Pomodoro" iconPosition="start" />
        <Tab icon={<LanguageIcon />} label="World Clock" iconPosition="start" />
        <Tab icon={<AvTimerIcon />} label="Stopwatch" iconPosition="start" />
      </Tabs>
    </Box>
  );
}
