import type { SxProps, Theme } from '@mui/material';

export const dialogPaperSx: SxProps<Theme> = {
  borderRadius: '1rem',
  padding: '0.5rem',
  maxWidth: '28rem',
};

export const dialogTitleSx: SxProps<Theme> = {
  fontSize: '1.25rem',
  fontWeight: 700,
  paddingBottom: '0.5rem',
};

export const dialogContentSx: SxProps<Theme> = {
  paddingTop: '0.5rem',
};

export const warningBoxSx: SxProps<Theme> = {
  border: '1px solid',
  borderColor: 'warning.light',
  borderRadius: '0.5rem',
  padding: '0.75rem 1rem',
  marginTop: '1rem',
  marginBottom: '1rem',
};

export const warningTextSx: SxProps<Theme> = {
  color: 'warning.dark',
  fontSize: '0.875rem',
  fontWeight: 500,
};

export const checkboxLabelSx: SxProps<Theme> = {
  fontSize: '0.875rem',
  color: 'text.secondary',
};

export const dialogActionsSx: SxProps<Theme> = {
  padding: '1rem 1.5rem',
  gap: '0.75rem',
};

export const confirmButtonSx: SxProps<Theme> = {
  minWidth: '8rem',
};
