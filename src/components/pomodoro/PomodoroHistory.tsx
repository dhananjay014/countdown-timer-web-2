import { memo, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { usePomodoroStore } from '../../stores/pomodoroStore';
import type { PomodoroSession } from '../../types/pomodoro';

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDateLabel(ts: number): string {
  const date = new Date(ts);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

function groupByDate(sessions: PomodoroSession[]): Map<string, PomodoroSession[]> {
  const groups = new Map<string, PomodoroSession[]>();
  // Reverse to show most recent first
  const sorted = [...sessions].reverse();
  for (const session of sorted) {
    const key = new Date(session.completedAt).toDateString();
    const group = groups.get(key) ?? [];
    group.push(session);
    groups.set(key, group);
  }
  return groups;
}

function getTodayFocusTime(sessions: PomodoroSession[]): number {
  const todayStr = new Date().toDateString();
  return sessions
    .filter((s) => new Date(s.completedAt).toDateString() === todayStr)
    .reduce((sum, s) => sum + s.durationSeconds, 0);
}

export const PomodoroHistory = memo(function PomodoroHistory() {
  const history = usePomodoroStore((s) => s.history);
  const clearHistory = usePomodoroStore((s) => s.clearHistory);

  const grouped = useMemo(() => groupByDate(history), [history]);
  const todayFocus = useMemo(() => getTodayFocusTime(history), [history]);

  if (history.length === 0) {
    return (
      <Card sx={{ width: '100%', maxWidth: 480, mx: 'auto' }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No completed work sessions yet.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Start a Pomodoro to track your focus time.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ width: '100%', maxWidth: 480, mx: 'auto' }}>
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            History
          </Typography>
          <Button size="small" color="error" onClick={clearHistory}>
            Clear
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Today&apos;s focus: {formatDuration(todayFocus)}
        </Typography>

        <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
          <List disablePadding>
            {[...grouped.entries()].map(([dateKey, sessions], groupIdx) => (
              <Box key={dateKey}>
                {groupIdx > 0 && <Divider sx={{ my: 1 }} />}
                <Typography variant="caption" color="text.secondary" sx={{ px: 2, pt: 1, display: 'block' }}>
                  {formatDateLabel(sessions[0].completedAt)}
                </Typography>
                {sessions.map((session) => (
                  <ListItem key={session.id} dense>
                    <ListItemText
                      primary={`Work session — ${formatDuration(session.durationSeconds)}`}
                      secondary={formatTimestamp(session.completedAt)}
                    />
                  </ListItem>
                ))}
              </Box>
            ))}
          </List>
        </Box>
      </CardContent>
    </Card>
  );
});
