import type { SxProps, Theme } from '@mui/material';

export const containerSx: SxProps<Theme> = {
  padding: { xs: '2rem 1rem', md: '3rem 2rem' },
  backgroundColor: 'grey.100',
};

export const gridContainerSx: SxProps<Theme> = {
  maxWidth: '60rem',
  margin: '0 auto',
};

export const stepCardSx: SxProps<Theme> = {
  padding: '1.5rem',
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
  width: '4rem',
  height: '4rem',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '1rem',
};

export const stepNumberSx: SxProps<Theme> = {
  fontSize: '0.75rem',
  fontWeight: 700,
  color: 'text.secondary',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginBottom: '0.5rem',
};

export const stepTitleSx: SxProps<Theme> = {
  fontSize: '1.125rem',
  fontWeight: 600,
  marginBottom: '0.5rem',
};

export const stepDescriptionSx: SxProps<Theme> = {
  fontSize: '0.875rem',
  color: 'text.secondary',
  lineHeight: 1.5,
};

export const arrowContainerSx: SxProps<Theme> = {
  display: { xs: 'none', md: 'flex' },
  alignItems: 'center',
  justifyContent: 'center',
  color: 'grey.400',
};
