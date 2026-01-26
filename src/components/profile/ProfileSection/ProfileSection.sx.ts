import type { SxProps, Theme } from '@mui/material';

export const sectionSx: SxProps<Theme> = {
  backgroundColor: 'background.paper',
  borderRadius: '0.75rem',
  padding: '1.5rem',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
};

export const sectionTitleSx: SxProps<Theme> = {
  fontSize: '1.125rem',
  fontWeight: 600,
  marginBottom: '1rem',
  color: 'text.primary',
};
