import type { SxProps, Theme } from '@mui/material';

export const pageContainerSx: SxProps<Theme> = {
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
};

export const mainContentSx: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
};
