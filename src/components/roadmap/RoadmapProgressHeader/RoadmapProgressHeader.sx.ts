import type { SxProps, Theme } from '@mui/material';

export const headerContainerSx: SxProps<Theme> = {
  position: 'sticky',
  top: 0,
  zIndex: 10,
  backgroundColor: 'background.paper',
  borderBottom: '1px solid',
  borderColor: 'grey.200',
  padding: { xs: '0.75rem 1rem', md: '1rem 1.5rem' },
};

export const headerContentSx: SxProps<Theme> = {
  maxWidth: '75rem',
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '0.75rem',
};

export const roleNameSx: SxProps<Theme> = {
  fontSize: { xs: '1rem', md: '1.25rem' },
  fontWeight: 600,
  color: 'text.primary',
};

export const progressWrapperSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
};

export const progressBoxSx: SxProps<Theme> = {
  position: 'relative',
  display: 'inline-flex',
};

export const progressLabelContainerSx: SxProps<Theme> = {
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const progressPercentageSx: SxProps<Theme> = {
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'text.primary',
};

export const progressTextSx: SxProps<Theme> = {
  fontSize: '0.875rem',
  color: 'text.secondary',
  display: { xs: 'none', sm: 'block' },
};
