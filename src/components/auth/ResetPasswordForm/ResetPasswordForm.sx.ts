import type { SxProps, Theme } from '@mui/material';

export const formSx: SxProps<Theme> = {
  width: '100%',
};

export const submitButtonSx: SxProps<Theme> = {
  padding: '0.75rem',
  fontSize: '1rem',
  borderRadius: '0.5rem',
  fontWeight: 600,
  boxShadow: '0 4px 14px 0 rgba(13, 148, 136, 0.39)',
  '&:hover': {
    boxShadow: '0 6px 20px 0 rgba(13, 148, 136, 0.5)',
  },
};

export const loginLinkContainerSx: SxProps<Theme> = {
  textAlign: 'center',
  marginTop: '1rem',
};

export const alertSx: SxProps<Theme> = {
  borderRadius: '0.5rem',
};
