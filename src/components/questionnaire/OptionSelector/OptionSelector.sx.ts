import type { SxProps, Theme } from '@mui/material';

export const containerSx: SxProps<Theme> = {
  width: '100%',
};

export const optionCardSx: SxProps<Theme> = {
  padding: '1rem 1.25rem',
  cursor: 'pointer',
  border: '2px solid',
  borderColor: 'grey.200',
  borderRadius: '0.75rem',
  backgroundColor: 'background.paper',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    borderColor: 'primary.light',
    backgroundColor: 'grey.50',
  },
};

export const optionCardSelectedSx: SxProps<Theme> = {
  padding: '1rem 1.25rem',
  cursor: 'pointer',
  border: '2px solid',
  borderRadius: '0.75rem',
  transition: 'all 0.2s ease-in-out',
  borderColor: 'primary.main',
  backgroundColor: 'primary.main',
  color: 'primary.contrastText',
  '&:hover': {
    borderColor: 'primary.dark',
    backgroundColor: 'primary.dark',
  },
};

export const optionLabelSx: SxProps<Theme> = {
  fontSize: '1rem',
  fontWeight: 500,
  textAlign: 'center',
};

export const optionLabelSelectedSx: SxProps<Theme> = {
  fontSize: '1rem',
  fontWeight: 500,
  textAlign: 'center',
  color: 'primary.contrastText',
};
