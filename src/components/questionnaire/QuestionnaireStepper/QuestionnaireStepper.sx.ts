import type { SxProps, Theme } from '@mui/material';

export const stepperContainerSx: SxProps<Theme> = {
  width: '100%',
  padding: { xs: '1rem', md: '1.5rem 2rem' },
  backgroundColor: 'background.paper',
  borderRadius: '0.75rem',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
};

export const getStepperSx = (): SxProps<Theme> => ({
  '& .MuiStepLabel-root': {
    padding: 0,
  },
  '& .MuiStepLabel-iconContainer': {
    paddingRight: 0,
  },
  '& .MuiStepConnector-line': {
    borderColor: 'grey.300',
    borderTopWidth: '2px',
  },
  '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
    borderColor: 'primary.main',
  },
  '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
    borderColor: 'primary.main',
  },
  // Last connector (before open question) - lighter line
  // The last connector is always the second-to-last child (before the final Step)
  '& > :nth-last-child(2) .MuiStepConnector-line': {
    opacity: 0.4,
  },
});

export const stepperSx: SxProps<Theme> = {
  '& .MuiStepLabel-root': {
    padding: 0,
  },
  '& .MuiStepLabel-iconContainer': {
    paddingRight: 0,
  },
  '& .MuiStepConnector-line': {
    borderColor: 'grey.300',
  },
  '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
    borderColor: 'primary.main',
  },
  '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
    borderColor: 'primary.main',
  },
};

export const mobileStepperSx: SxProps<Theme> = {
  backgroundColor: 'transparent',
  padding: 0,
  justifyContent: 'center',
  '& .MuiMobileStepper-dot': {
    width: '0.625rem',
    height: '0.625rem',
    margin: '0 0.25rem',
  },
  '& .MuiMobileStepper-dotActive': {
    backgroundColor: 'primary.main',
  },
};

export const progressTextSx: SxProps<Theme> = {
  textAlign: 'center',
  fontSize: '0.875rem',
  color: 'text.secondary',
  marginBottom: '0.75rem',
  fontWeight: 500,
};

// Base step icon styles (circular for numbered questions)
const baseStepIconSx: SxProps<Theme> = {
  width: '1.75rem',
  height: '1.75rem',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.75rem',
  fontWeight: 600,
  transition: 'all 0.2s ease',
};

export const stepIconSx: SxProps<Theme> = {
  ...baseStepIconSx,
  backgroundColor: 'grey.200',
  color: 'grey.500',
};

export const stepIconActiveSx: SxProps<Theme> = {
  ...baseStepIconSx,
  backgroundColor: 'primary.main',
  color: 'white',
  boxShadow: '0 0 0 4px rgba(13, 148, 136, 0.2)',
};

export const stepIconCompletedSx: SxProps<Theme> = {
  ...baseStepIconSx,
  backgroundColor: 'primary.main',
  color: 'white',
};

// Open question icon styles (rounded rectangle)
const baseOpenQuestionIconSx: SxProps<Theme> = {
  width: '2rem',
  height: '1.75rem',
  borderRadius: '0.375rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
};

export const openQuestionIconSx: SxProps<Theme> = {
  ...baseOpenQuestionIconSx,
  backgroundColor: 'grey.200',
  color: 'grey.500',
};

export const openQuestionIconActiveSx: SxProps<Theme> = {
  ...baseOpenQuestionIconSx,
  backgroundColor: 'secondary.main',
  color: 'white',
  border: 'none',
  boxShadow: '0 0 0 4px rgba(245, 158, 11, 0.2)',
};

export const openQuestionIconCompletedSx: SxProps<Theme> = {
  ...baseOpenQuestionIconSx,
  backgroundColor: 'secondary.main',
  color: 'white',
  border: 'none',
};
