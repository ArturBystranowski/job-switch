import type { SxProps, Theme } from '@mui/material';

export const textFieldSx: SxProps<Theme> = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '0.5rem',
  },
};

export const iconButtonSx: SxProps<Theme> = {
  color: 'text.secondary',
};
