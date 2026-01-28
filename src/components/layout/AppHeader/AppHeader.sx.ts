import type { SxProps, Theme } from '@mui/material';

export const headerSx: SxProps<Theme> = {
  backgroundColor: 'transparent',
  boxShadow: 'none',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 10,
};

export const toolbarSx: SxProps<Theme> = {
  justifyContent: 'space-between',
  padding: { xs: '0.5rem 1rem', md: '1rem 2rem' },
  maxWidth: '67.5rem',
  width: '100%',
  margin: '0 auto',
};

export const logoSx: SxProps<Theme> = {
  fontSize: { xs: '1.25rem', sm: '1.5rem' },
  fontWeight: 700,
  background: 'linear-gradient(135deg, #0D9488 0%, #6366F1 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  cursor: 'pointer',
  textDecoration: 'none',
  '&:hover': {
    opacity: 0.9,
  },
};

export const authButtonsContainerSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
};

export const loginButtonSx: SxProps<Theme> = {
  borderRadius: '0.5rem',
  textTransform: 'none',
  fontWeight: 600,
  padding: { xs: '0.375rem 1rem', md: '0.5rem 1.25rem' },
};

export const registerButtonSx: SxProps<Theme> = {
  borderRadius: '0.5rem',
  textTransform: 'none',
  fontWeight: 600,
  padding: { xs: '0.375rem 1rem', md: '0.5rem 1.25rem' },
  boxShadow: '0 2px 8px 0 rgba(13, 148, 136, 0.25)',
  '&:hover': {
    boxShadow: '0 4px 12px 0 rgba(13, 148, 136, 0.35)',
  },
};
