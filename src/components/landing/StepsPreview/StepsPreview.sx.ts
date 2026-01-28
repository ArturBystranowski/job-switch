import type { SxProps, Theme } from '@mui/material';

export const containerSx: SxProps<Theme> = {
  padding: { xs: '1.25rem 1rem', md: '1.5rem 2rem' },
  backgroundColor: 'grey.100',
};

export const gridContainerSx: SxProps<Theme> = {
  maxWidth: '60rem',
  margin: '0 auto',
};

export const stepCardSx: SxProps<Theme> = {
  padding: '1rem',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  borderRadius: '0.75rem',
  backgroundColor: 'background.paper',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
  },
};

export const iconContainerSx: SxProps<Theme> = {
  width: '3rem',
  height: '3rem',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '0.5rem',
};

export const stepNumberSx: SxProps<Theme> = {
  fontSize: '0.6875rem',
  fontWeight: 700,
  color: 'text.secondary',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginBottom: '0.25rem',
};

export const stepTitleSx: SxProps<Theme> = {
  fontSize: '1rem',
  fontWeight: 600,
  marginBottom: '0.25rem',
};

export const stepDescriptionSx: SxProps<Theme> = {
  fontSize: '0.8125rem',
  color: 'text.secondary',
  lineHeight: 1.4,
};

export const arrowContainerSx: SxProps<Theme> = {
  display: { xs: 'none', md: 'flex' },
  alignItems: 'center',
  justifyContent: 'center',
  color: 'grey.400',
};
