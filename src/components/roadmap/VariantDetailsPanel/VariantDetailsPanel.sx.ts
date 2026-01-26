import type { SxProps, Theme } from '@mui/material';

export const panelContainerSx: SxProps<Theme> = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

export const panelHeaderSx: SxProps<Theme> = {
  padding: '1.25rem 1.5rem',
  borderBottom: '1px solid',
  borderColor: 'grey.200',
};

export const panelTitleSx: SxProps<Theme> = {
  fontSize: '1.125rem',
  fontWeight: 600,
  color: 'text.primary',
};

export const stepTitleSx: SxProps<Theme> = {
  fontSize: '0.8125rem',
  color: 'text.secondary',
  marginTop: '0.25rem',
};

export const panelContentSx: SxProps<Theme> = {
  flex: 1,
  overflow: 'auto',
  padding: '1.25rem 1.5rem',
};

export const descriptionSx: SxProps<Theme> = {
  fontSize: '0.9375rem',
  color: 'text.primary',
  lineHeight: 1.6,
  marginBottom: '1.25rem',
};

export const metaContainerSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.75rem',
  backgroundColor: 'grey.100',
  borderRadius: '0.5rem',
  marginBottom: '1.25rem',
};

export const metaIconSx: SxProps<Theme> = {
  color: 'text.secondary',
  fontSize: '1.25rem',
};

export const metaTextSx: SxProps<Theme> = {
  fontSize: '0.875rem',
  color: 'text.secondary',
};

export const sectionTitleSx: SxProps<Theme> = {
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'text.primary',
  marginBottom: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

export const resourcesListSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

export const resourceItemSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.75rem',
  backgroundColor: 'background.paper',
  border: '1px solid',
  borderColor: 'grey.200',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  textDecoration: 'none',
  '&:hover': {
    borderColor: 'primary.main',
    backgroundColor: 'primary.light',
  },
};

export const resourceIconSx: SxProps<Theme> = {
  color: 'primary.main',
  fontSize: '1.25rem',
};

export const resourceTextSx: SxProps<Theme> = {
  fontSize: '0.875rem',
  color: 'text.primary',
  flex: 1,
};

export const panelFooterSx: SxProps<Theme> = {
  padding: '1rem 1.5rem',
  borderTop: '1px solid',
  borderColor: 'grey.200',
};

export const emptyStateSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  padding: '2rem',
  textAlign: 'center',
  color: 'text.secondary',
};

export const emptyIconSx: SxProps<Theme> = {
  fontSize: '3rem',
  color: 'grey.400',
  marginBottom: '1rem',
};

export const emptyTextSx: SxProps<Theme> = {
  fontSize: '0.9375rem',
};
