import type { SxProps, Theme } from '@mui/material';

export const heroContainerSx: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: { xs: '1.5rem 1rem', md: '2rem 2rem' },
};

export const titleSx: SxProps<Theme> = {
  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
  fontWeight: 700,
  marginBottom: '0.75rem',
  background: 'linear-gradient(135deg, #0D9488 0%, #6366F1 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

export const subtitleSx: SxProps<Theme> = {
  fontSize: { xs: '0.9375rem', sm: '1rem', md: '1.125rem' },
  color: 'text.secondary',
  maxWidth: '40rem',
  marginBottom: '1.5rem',
  lineHeight: 1.5,
};

export const ctaButtonSx: SxProps<Theme> = {
  padding: { xs: '0.75rem 1.75rem', md: '0.875rem 2.5rem' },
  fontSize: { xs: '0.9375rem', md: '1rem' },
  borderRadius: '0.75rem',
  boxShadow: '0 4px 14px 0 rgba(13, 148, 136, 0.39)',
  '&:hover': {
    boxShadow: '0 6px 20px 0 rgba(13, 148, 136, 0.5)',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.2s ease-in-out',
};
