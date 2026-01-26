import type { SxProps, Theme } from '@mui/material';

export const stepperContainerSx: SxProps<Theme> = {
  width: '100%',
  padding: { xs: '1rem', md: '1.5rem 2rem' },
  backgroundColor: 'background.paper',
  borderRadius: '0.75rem',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
};

export const stepperSx: SxProps<Theme> = {
  '& .MuiStepLabel-label': {
    fontSize: { xs: '0.75rem', sm: '0.875rem' },
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
  marginBottom: '0.5rem',
};
