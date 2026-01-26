import type { SxProps, Theme } from '@mui/material';

export const overlaySx: SxProps<Theme> = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2rem',
};

export const contentSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1.5rem',
  maxWidth: '24rem',
  textAlign: 'center',
  padding: '2rem',
};

export const messageSx: SxProps<Theme> = {
  minHeight: '3rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const progressContainerSx: SxProps<Theme> = {
  position: 'relative',
  display: 'inline-flex',
};

export const progressTextSx: SxProps<Theme> = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};
