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

export const tasksPanelContainerSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
};

export const tasksPanelHeaderSx: SxProps<Theme> = {
  padding: '1.25rem 1.5rem',
  borderBottom: '1px solid',
  borderColor: 'grey.200',
};

export const tasksPanelTitleSx: SxProps<Theme> = {
  fontSize: '1.125rem',
  fontWeight: 600,
  color: 'text.primary',
};

export const tasksPanelSubtitleSx: SxProps<Theme> = {
  fontSize: '0.8125rem',
  color: 'text.secondary',
  marginTop: '0.25rem',
};

export const tasksListSx: SxProps<Theme> = {
  flex: 1,
  overflow: 'auto',
  padding: '1rem 1.5rem',
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
