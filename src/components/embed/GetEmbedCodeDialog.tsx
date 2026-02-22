import { useState, useMemo } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface GetEmbedCodeDialogProps {
  open: boolean;
  onClose: () => void;
  timerLabel: string;
  timerTotalSeconds: number;
}

const BASE_URL = 'https://countdown-timer-web-2.vercel.app';

export function GetEmbedCodeDialog({ open, onClose, timerLabel, timerTotalSeconds }: GetEmbedCodeDialogProps) {
  const [tabIndex, setTabIndex] = useState(0);
  const [themeChoice, setThemeChoice] = useState<'light' | 'dark'>('light');
  const [snackOpen, setSnackOpen] = useState(false);

  const mode = tabIndex === 0 ? 'minimal' : 'full';

  const iframeSrc = useMemo(() => {
    const params = new URLSearchParams();
    params.set('l', timerLabel);
    params.set('d', String(timerTotalSeconds));
    params.set('mode', mode);
    params.set('theme', themeChoice);
    return `${BASE_URL}/embed/timer?${params.toString()}`;
  }, [timerLabel, timerTotalSeconds, mode, themeChoice]);

  const iframeSnippet = `<iframe src="${iframeSrc}" width="300" height="350" style="border:none;border-radius:8px;" allow="autoplay"></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(iframeSnippet).then(() => setSnackOpen(true));
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Get Embed Code</DialogTitle>
        <DialogContent>
          <Tabs value={tabIndex} onChange={(_, v: number) => setTabIndex(v)} sx={{ mb: 2 }}>
            <Tab label="Minimal" />
            <Tab label="Full" />
          </Tabs>
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Theme</FormLabel>
            <RadioGroup
              row
              value={themeChoice}
              onChange={(e) => setThemeChoice(e.target.value as 'light' | 'dark')}
            >
              <FormControlLabel value="light" control={<Radio />} label="Light" />
              <FormControlLabel value="dark" control={<Radio />} label="Dark" />
            </RadioGroup>
          </FormControl>
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <TextField
              fullWidth
              multiline
              minRows={3}
              value={iframeSnippet}
              slotProps={{ input: { readOnly: true } }}
              sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
            />
            <IconButton onClick={handleCopy} aria-label="copy embed code">
              <ContentCopyIcon />
            </IconButton>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackOpen}
        autoHideDuration={2000}
        onClose={() => setSnackOpen(false)}
        message="Copied!"
      />
    </>
  );
}
