import type { SxProps, Theme } from '@mui/material';

export const drawerPaperSx: SxProps<Theme> = {
  borderTopLeftRadius: '1rem',
  borderTopRightRadius: '1rem',
  maxHeight: '100vh',
};

export const drawerContainerSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  maxHeight: '100vh',
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

export const drawerHeaderSx: SxProps<Theme> = {
  position: 'relative',
  padding: '0 1rem 1rem',
  borderBottom: '1px solid',
  borderColor: 'grey.200',
};

export const drawerCloseButtonSx: SxProps<Theme> = {
  position: 'absolute',
  top: '-0.5rem',
  right: '0.5rem',
};

export const drawerTitleSx: SxProps<Theme> = {
  fontSize: '1.125rem',
  fontWeight: 600,
  color: 'text.primary',
};

export const drawerDescriptionSx: SxProps<Theme> = {
  fontSize: '0.875rem',
  color: 'text.secondary',
  marginTop: '0.5rem',
  lineHeight: 1.5,
};

export const drawerProgressRowSx: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '0.75rem 1rem',
};

export const drawerSubtitleSx: SxProps<Theme> = {
  fontSize: '0.8125rem',
  color: 'text.secondary',
  whiteSpace: 'nowrap',
};

export const drawerContentSx: SxProps<Theme> = {
  flex: 1,
  overflow: 'auto',
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

export const getTaskAccordionSx = (isCompleted: boolean): SxProps<Theme> => ({
  border: '1px solid',
  borderColor: isCompleted ? '#0D9488' : 'grey.200',
  borderRadius: '0.5rem !important',
  backgroundColor: isCompleted ? 'rgba(13, 148, 136, 0.05)' : 'background.paper',
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: 0,
  },
});

export const taskAccordionSummarySx: SxProps<Theme> = {
  padding: '0.5rem 0.75rem',
  minHeight: 'unset',
  '&.Mui-expanded': {
    minHeight: 'unset',
  },
  '& .MuiAccordionSummary-content': {
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.5rem',
    '&.Mui-expanded': {
      margin: 0,
    },
  },
};

export const taskAccordionSummaryContentSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flex: 1,
  gap: '1rem',
};

export const taskTitleSx: SxProps<Theme> = {
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'text.primary',
};

export const taskTimeSx: SxProps<Theme> = {
  color: 'text.secondary',
  fontSize: '0.75rem',
  '& .MuiTypography-root': {
    fontSize: '0.75rem',
  },
};

export const taskAccordionActionsSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  '& .MuiIconButton-root': {
    padding: '0.25rem',
  },
};

export const taskAccordionDetailsSx: SxProps<Theme> = {
  padding: '0 0.75rem 0.75rem 2.75rem',
  borderTop: '1px solid',
  borderColor: 'grey.100',
};

export const taskDescriptionSx: SxProps<Theme> = {
  fontSize: '0.9375rem',
  color: 'text.secondary',
  lineHeight: 1.7,
};

export const checkboxContainerSx = (isCompleted: boolean): SxProps<Theme> => ({
  width: '1.125rem',
  height: '1.125rem',
  borderRadius: '0.25rem',
  border: '2px solid',
  borderColor: isCompleted ? '#0D9488' : 'grey.400',
  backgroundColor: isCompleted ? '#0D9488' : 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  flexShrink: 0,
  transition: 'all 0.15s ease',
  '&:hover': {
    borderColor: '#0D9488',
  },
});

export const drawerFooterSx: SxProps<Theme> = {
  padding: '1rem',
  borderTop: '1px solid',
  borderColor: 'grey.200',
};
