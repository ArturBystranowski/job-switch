import type { SxProps, Theme } from '@mui/material';

export const cardSx: SxProps<Theme> = {
  padding: '1.5rem',
  borderRadius: '1rem',
  border: '2px solid',
  borderColor: 'grey.200',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    borderColor: 'grey.300',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
};

export const recommendedCardSx: SxProps<Theme> = {
  padding: '1.5rem',
  borderRadius: '1rem',
  border: '3px solid',
  borderColor: 'primary.main',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.2s ease-in-out',
  boxShadow: '0 4px 12px rgba(13, 148, 136, 0.15)',
  '&:hover': {
    boxShadow: '0 6px 16px rgba(13, 148, 136, 0.25)',
  },
};

export const headerSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginBottom: '1rem',
};

export const titleSx: SxProps<Theme> = {
  fontSize: '1.25rem',
  fontWeight: 700,
  color: 'text.primary',
};

export const justificationSx: SxProps<Theme> = {
  fontSize: '0.9375rem',
  color: 'text.secondary',
  lineHeight: 1.6,
  flex: 1,
  marginBottom: '1.5rem',
};

export const actionSx: SxProps<Theme> = {
  marginTop: 'auto',
};

export const selectButtonSx: SxProps<Theme> = {
  width: '100%',
  padding: '0.75rem',
};
