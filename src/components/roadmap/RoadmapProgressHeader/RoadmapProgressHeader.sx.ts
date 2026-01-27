import type { SxProps, Theme } from '@mui/material';

export const headerContainerSx: SxProps<Theme> = {
  position: 'sticky',
  top: 0,
  zIndex: 10,
  backgroundColor: 'background.paper',
  borderBottom: '1px solid',
  borderColor: 'grey.200',
};

export const headerContentSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  flexDirection: { xs: 'column', lg: 'row' },
};

export const leftSectionSx: SxProps<Theme> = {
  flex: { xs: 1, lg: '0 0 70%' },
  padding: { xs: '0.75rem 1rem', md: '1rem 1.5rem' },
  width: '100%',
};

export const roleSectionWrapperSx: SxProps<Theme> = {
  maxWidth: '40rem',
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  gap: { xs: '0.75rem', md: '1rem' },
};

export const roleNameSx: SxProps<Theme> = {
  fontSize: { xs: '1rem', md: '1.25rem' },
  fontWeight: 600,
  color: 'text.primary',
  ml: '64px',
};

export const rightSectionSx: SxProps<Theme> = {
  display: { xs: 'none', lg: 'flex' },
  flex: '0 0 30%',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderLeft: '1px solid',
  borderColor: 'grey.200',
  padding: '1rem 1.5rem',
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

export const progressTextSx: SxProps<Theme> = {
  fontSize: '0.875rem',
  color: 'text.secondary',
};

export const profileIconSx: SxProps<Theme> = {
  color: 'text.secondary',
  '&:hover': {
    color: 'primary.main',
    backgroundColor: 'action.hover',
  },
};
