import type { SxProps, Theme } from '@mui/material';

export const listSx: SxProps<Theme> = {
  padding: 0,
};

export const listItemSx: SxProps<Theme> = {
  padding: '0.75rem 0',
  borderBottom: '1px solid',
  borderColor: 'grey.200',
};

export const questionSx: SxProps<Theme> = {
  fontSize: '0.875rem',
  color: 'text.secondary',
  marginBottom: '0.25rem',
};

export const questionNumberSx: SxProps<Theme> = {
  fontWeight: 600,
  marginRight: '0.375rem',
  color: 'primary.main',
};

export const answerSx: SxProps<Theme> = {
  fontSize: '1rem',
  fontWeight: 500,
  color: 'text.primary',
};

export const openAnswerContainerSx: SxProps<Theme> = {
  marginTop: '1rem',
  padding: '1rem',
  backgroundColor: 'grey.50',
  borderRadius: '0.5rem',
  border: '1px solid',
  borderColor: 'grey.200',
};

export const openAnswerLabelSx: SxProps<Theme> = {
  fontSize: '0.875rem',
  color: 'text.secondary',
  fontWeight: 500,
  marginBottom: '0.5rem',
};

export const openAnswerTextSx: SxProps<Theme> = {
  fontSize: '1rem',
  color: 'text.primary',
  fontStyle: 'italic',
  lineHeight: 1.6,
};

export const openAnswerChipSx: SxProps<Theme> = {
  height: '1.25rem',
  fontSize: '0.625rem',
  backgroundColor: 'grey.200',
  color: 'text.secondary',
};
