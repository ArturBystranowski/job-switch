import type { SxProps, Theme } from '@mui/material';

export const drawerPaperSx: SxProps<Theme> = {
  borderTopLeftRadius: '1rem',
  borderTopRightRadius: '1rem',
  maxHeight: '85vh',
};

export const sheetContainerSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  maxHeight: '85vh',
};

export const handleContainerSx: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  padding: '0.75rem 0 0.5rem',
};

export const handleSx: SxProps<Theme> = {
  width: '2.5rem',
  height: '0.25rem',
  backgroundColor: 'grey.300',
  borderRadius: '0.125rem',
};

export const sheetHeaderSx: SxProps<Theme> = {
  padding: '0 1rem 1rem',
  borderBottom: '1px solid',
  borderColor: 'grey.200',
};

export const sheetTitleSx: SxProps<Theme> = {
  fontSize: '1rem',
  fontWeight: 600,
  color: 'text.primary',
};

export const sheetStepTitleSx: SxProps<Theme> = {
  fontSize: '0.8125rem',
  color: 'text.secondary',
  marginTop: '0.25rem',
};

export const sheetContentSx: SxProps<Theme> = {
  flex: 1,
  overflow: 'auto',
  padding: '1rem',
};

export const sheetDescriptionSx: SxProps<Theme> = {
  fontSize: '0.9375rem',
  color: 'text.primary',
  lineHeight: 1.6,
  marginBottom: '1rem',
};

export const sheetMetaContainerSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.75rem',
  backgroundColor: 'grey.100',
  borderRadius: '0.5rem',
  marginBottom: '1rem',
};

export const sheetMetaIconSx: SxProps<Theme> = {
  color: 'text.secondary',
  fontSize: '1.25rem',
};

export const sheetMetaTextSx: SxProps<Theme> = {
  fontSize: '0.875rem',
  color: 'text.secondary',
};

export const sheetSectionTitleSx: SxProps<Theme> = {
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: 'text.primary',
  marginBottom: '0.5rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

export const sheetResourcesListSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

export const sheetResourceItemSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.75rem',
  backgroundColor: 'background.paper',
  border: '1px solid',
  borderColor: 'grey.200',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  textDecoration: 'none',
  '&:active': {
    backgroundColor: 'grey.100',
  },
};

export const sheetResourceIconSx: SxProps<Theme> = {
  color: 'primary.main',
  fontSize: '1.25rem',
};

export const sheetResourceTextSx: SxProps<Theme> = {
  fontSize: '0.875rem',
  color: 'text.primary',
  flex: 1,
};

export const sheetFooterSx: SxProps<Theme> = {
  padding: '1rem',
  borderTop: '1px solid',
  borderColor: 'grey.200',
};
