import type { SxProps, Theme } from '@mui/material';

export const heroContainerSx: SxProps<Theme> = {
  minHeight: '60vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: { xs: '2rem 1rem', md: '4rem 2rem' },
};

export const titleSx: SxProps<Theme> = {
  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
  fontWeight: 700,
  marginBottom: '1rem',
  background: 'linear-gradient(135deg, #0D9488 0%, #6366F1 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

export const subtitleSx: SxProps<Theme> = {
  fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
  color: 'text.secondary',
  maxWidth: '40rem',
  marginBottom: '2.5rem',
  lineHeight: 1.6,
};

export const ctaButtonSx: SxProps<Theme> = {
  padding: { xs: '0.875rem 2rem', md: '1rem 3rem' },
  fontSize: { xs: '1rem', md: '1.125rem' },
  borderRadius: '0.75rem',
  boxShadow: '0 4px 14px 0 rgba(13, 148, 136, 0.39)',
  '&:hover': {
    boxShadow: '0 6px 20px 0 rgba(13, 148, 136, 0.5)',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.2s ease-in-out',
};
