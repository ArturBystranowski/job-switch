import type { SxProps, Theme } from '@mui/material';

export const pageContainerSx: SxProps<Theme> = {
  minHeight: '100vh',
  backgroundColor: 'grey.100',
  display: 'flex',
  flexDirection: 'column',
};

export const mainContentSx: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  flexDirection: { xs: 'column', lg: 'row' },
  overflow: 'hidden',
};

export const treeContainerSx: SxProps<Theme> = {
  flex: { xs: 1, lg: '0 0 70%' },
  overflow: 'auto',
  padding: { xs: '1rem', md: '1.5rem' },
  backgroundColor: 'background.default',
};

export const detailsPanelContainerSx: SxProps<Theme> = {
  display: { xs: 'none', lg: 'flex' },
  flex: '0 0 30%',
  borderLeft: '1px solid',
  borderColor: 'grey.200',
  backgroundColor: 'background.paper',
  overflow: 'hidden',
};

export const errorContainerSx: SxProps<Theme> = {
  maxWidth: '32rem',
  margin: '2rem auto',
  padding: '2rem',
};

export const emptyStateContainerSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '50vh',
  padding: '2rem',
  textAlign: 'center',
};

export const emptyStateTitleSx: SxProps<Theme> = {
  fontSize: '1.25rem',
  fontWeight: 600,
  marginBottom: '0.5rem',
};

export const emptyStateDescriptionSx: SxProps<Theme> = {
  fontSize: '0.9375rem',
  color: 'text.secondary',
  marginBottom: '1.5rem',
};
