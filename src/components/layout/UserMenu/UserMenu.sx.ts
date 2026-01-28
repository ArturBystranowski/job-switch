import type { SxProps, Theme } from '@mui/material';

export const avatarButtonSx: SxProps<Theme> = {
  padding: '0.25rem',
  borderRadius: '50%',
};

export const avatarSx: SxProps<Theme> = {
  width: 36,
  height: 36,
  backgroundColor: 'primary.main',
  fontSize: '0.875rem',
  fontWeight: 600,
};

export const menuSx: SxProps<Theme> = {
  '& .MuiPaper-root': {
    borderRadius: '0.75rem',
    minWidth: '12rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
};

export const emailTextSx: SxProps<Theme> = {
  padding: '0.5rem 1rem',
  color: 'text.secondary',
  fontSize: '0.875rem',
  fontWeight: 500,
};

export const menuItemSx: SxProps<Theme> = {
  padding: '0.75rem 1rem',
  fontSize: '0.875rem',
  '&:hover': {
    backgroundColor: 'grey.100',
  },
};

export const logoutItemSx: SxProps<Theme> = {
  ...menuItemSx,
  color: 'error.main',
};
