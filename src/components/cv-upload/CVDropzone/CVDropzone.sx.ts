import type { SxProps, Theme } from '@mui/material';

const baseDropzoneSx = {
  padding: '3rem 2rem',
  border: '2px dashed',
  borderRadius: '1rem',
  textAlign: 'center',
  transition: 'all 0.2s ease-in-out',
};

export const dropzoneSx: SxProps<Theme> = {
  ...baseDropzoneSx,
  borderColor: 'grey.300',
  backgroundColor: 'grey.50',
  cursor: 'pointer',
  '&:hover': {
    borderColor: 'primary.main',
    backgroundColor: 'grey.100',
  },
};

export const dropzoneActiveSx: SxProps<Theme> = {
  ...baseDropzoneSx,
  borderColor: 'primary.main',
  backgroundColor: 'primary.main',
  cursor: 'pointer',
  '& *': {
    color: 'primary.contrastText',
  },
};

export const dropzoneDisabledSx: SxProps<Theme> = {
  ...baseDropzoneSx,
  borderColor: 'grey.300',
  backgroundColor: 'grey.50',
  opacity: 0.6,
  cursor: 'not-allowed',
};

export const iconContainerSx: SxProps<Theme> = {
  marginBottom: '1rem',
};

export const uploadIconSx: SxProps<Theme> = {
  fontSize: '3rem',
  color: 'primary.main',
};

export const titleSx: SxProps<Theme> = {
  fontSize: '1.125rem',
  fontWeight: 600,
  marginBottom: '0.5rem',
};

export const subtitleSx: SxProps<Theme> = {
  fontSize: '0.875rem',
  color: 'text.secondary',
};

export const constraintsSx: SxProps<Theme> = {
  fontSize: '0.75rem',
  color: 'text.secondary',
  marginTop: '1rem',
};
