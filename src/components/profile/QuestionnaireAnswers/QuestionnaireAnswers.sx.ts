import type { SxProps, Theme } from '@mui/material';

export const listSx: SxProps<Theme> = {
  padding: 0,
};

export const listItemSx: SxProps<Theme> = {
  padding: '0.75rem 0',
  borderBottom: '1px solid',
  borderColor: 'grey.200',
  '&:last-child': {
    borderBottom: 'none',
  },
};

export const questionSx: SxProps<Theme> = {
  fontSize: '0.875rem',
  color: 'text.secondary',
  marginBottom: '0.25rem',
};

export const answerSx: SxProps<Theme> = {
  fontSize: '1rem',
  fontWeight: 500,
  color: 'text.primary',
};
