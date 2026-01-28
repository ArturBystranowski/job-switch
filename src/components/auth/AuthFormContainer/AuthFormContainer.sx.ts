import type { SxProps, Theme } from '@mui/material';

export const containerSx: SxProps<Theme> = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: { xs: '1rem', sm: '2rem' },
  background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)',
};

export const paperSx: SxProps<Theme> = {
  padding: { xs: '1.5rem', sm: '2.5rem' },
  borderRadius: '1rem',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  width: '100%',
};

export const logoContainerSx: SxProps<Theme> = {
  textAlign: 'center',
  marginBottom: '1.5rem',
};

export const logoTextSx: SxProps<Theme> = {
  fontSize: { xs: '1.5rem', sm: '1.75rem' },
  fontWeight: 700,
  background: 'linear-gradient(135deg, #0D9488 0%, #6366F1 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  cursor: 'pointer',
  textDecoration: 'none',
};

export const titleSx: SxProps<Theme> = {
  fontWeight: 600,
  textAlign: 'center',
  marginBottom: '1rem',
  color: 'text.primary',
};

export const subtitleSx: SxProps<Theme> = {
  textAlign: 'center',
  color: 'text.secondary',
  marginBottom: '1.5rem',
  lineHeight: 1.5,
};

export const backLinkContainerSx: SxProps<Theme> = {
  textAlign: 'center',
  marginTop: '1.5rem',
  paddingTop: '1rem',
  borderTop: '1px solid',
  borderColor: 'divider',
};

export const backLinkSx: SxProps<Theme> = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: 'text.secondary',
  fontSize: '0.875rem',
  transition: 'color 0.2s ease',
  '&:hover': {
    color: 'primary.main',
  },
};
