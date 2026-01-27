import type { SxProps, Theme } from '@mui/material';

export const badgeSx: SxProps<Theme> = {
  fontWeight: 600,
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  padding: '0.25rem 0.75rem',
  borderRadius: '1rem',
  width: 'fit-content',
  marginLeft: 'auto',
  justifySelf: 'flex-end',
};

export const recommendedBadgeSx: SxProps<Theme> = {
  ...badgeSx,
  backgroundColor: 'primary.main',
  color: 'primary.contrastText',
};

export const alternativeBadgeSx: SxProps<Theme> = {
  ...badgeSx,
  backgroundColor: 'grey.200',
  color: 'text.secondary',
};
