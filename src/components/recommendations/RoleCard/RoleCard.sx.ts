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

export const titleSx: SxProps<Theme> = {
  fontSize: '1.25rem',
  fontWeight: 700,
  color: 'text.primary',
};

export const descriptionBoxSx: SxProps<Theme> = {
  flex: 1,
};

export const avatarSx: SxProps<Theme> = {
  width: '200px',
  height: '200px',padding: '1rem',
  backgroundColor: 'grey.100',
  color: 'grey.400',
  float: 'right',
  marginLeft: '1rem',
  marginBottom: '0.5rem',
  shapeOutside: 'margin-box',
};

export const justificationSx: SxProps<Theme> = {
  fontSize: '0.9375rem',
  color: 'text.secondary',
  lineHeight: 1.6,
};

export const actionSx: SxProps<Theme> = {
  marginTop: '1.5rem',
};

export const selectButtonSx: SxProps<Theme> = {
  width: '100%',
  padding: '0.75rem',
};
