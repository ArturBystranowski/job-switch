import type { SxProps, Theme } from '@mui/material';

export const previewContainerSx: SxProps<Theme> = {
  padding: '1rem 1.5rem',
  borderRadius: '0.75rem',
  backgroundColor: 'grey.100',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
};

export const iconContainerSx: SxProps<Theme> = {
  width: '3rem',
  height: '3rem',
  borderRadius: '0.5rem',
  backgroundColor: 'background.paper',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const fileInfoSx: SxProps<Theme> = {
  flex: 1,
  minWidth: 0,
};

export const fileNameSx: SxProps<Theme> = {
  fontWeight: 600,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export const fileSizeSx: SxProps<Theme> = {
  fontSize: '0.875rem',
  color: 'text.secondary',
};

export const successIconSx: SxProps<Theme> = {
  fontSize: '1.5rem',
  color: 'success.main',
};

export const errorIconSx: SxProps<Theme> = {
  fontSize: '1.5rem',
  color: 'error.main',
};

export const removeButtonSx: SxProps<Theme> = {
  color: 'text.secondary',
  '&:hover': {
    color: 'error.main',
  },
};
