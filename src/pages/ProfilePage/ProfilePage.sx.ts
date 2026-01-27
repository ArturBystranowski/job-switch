import type { SxProps, Theme } from '@mui/material';

export const pageContainerSx: SxProps<Theme> = {
  minHeight: '100vh',
  backgroundColor: 'grey.100',
  padding: { xs: '1rem', md: '2rem' },
};

export const contentContainerSx: SxProps<Theme> = {
  maxWidth: '48rem',
  margin: '0 auto',
};

export const roleSectionLabelSx: SxProps<Theme> = {
  marginTop: '1.5rem',
  marginBottom: '0.75rem',
};

export const topSectionSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  gap: '1rem',
  marginBottom: '1rem',
};

export const roleSectionSx: SxProps<Theme> = {
  flex: { xs: 1, md: '0 0 66.666%' },
};

export const progressSectionSx: SxProps<Theme> = {
  flex: { xs: 1, md: '0 0 33.333%' },
};

export const roleCardSx: SxProps<Theme> = {
  position: 'relative',
  padding: '1.25rem',
  backgroundColor: '#0D9488',
  borderRadius: '0.75rem',
  color: 'white',
  height: '100%',
};

export const roleCardHeaderSx: SxProps<Theme> = {};

export const roleAvatarSx: SxProps<Theme> = {
  width: '9.375rem',
  height: '9.375rem',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: 'white',
  float: 'right',
  marginLeft: '1rem',
  marginBottom: '0.5rem',
  shapeOutside: 'margin-box',
};

export const roleCardLockSx: SxProps<Theme> = {
  position: 'absolute',
  top: '0.75rem',
  right: '0.75rem',
  fontSize: '1.25rem',
  color: 'rgba(255, 255, 255, 0.7)',
  cursor: 'pointer',
  '&:hover': {
    color: 'white',
  },
};

export const roleNameSx: SxProps<Theme> = {
  fontSize: '1.25rem',
  fontWeight: 600,
};

export const roleJustificationSx: SxProps<Theme> = {
  fontSize: '0.875rem',
  opacity: 0.9,
  lineHeight: 1.6,
  marginTop: '0.375rem',
};

export const progressContainerSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '1.25rem',
  backgroundColor: 'background.paper',
  borderRadius: '0.75rem',
  height: '100%',
};

export const progressCircleBoxSx: SxProps<Theme> = {
  position: 'relative',
  display: 'inline-flex',
};

export const getProgressPercentageSx = (isCompleted: boolean): SxProps<Theme> => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  fontSize: '1rem',
  fontWeight: 700,
  color: isCompleted ? 'primary.main' : 'secondary.main',
});

export const getArrowForwardIconSx = (isCompleted: boolean): SxProps<Theme> => ({
  color: isCompleted ? 'primary.main' : 'secondary',
});

export const progressInfoSx: SxProps<Theme> = {
  flex: 1,
};

export const progressLabelSx: SxProps<Theme> = {
  fontSize: '0.75rem',
  color: 'text.secondary',
};

export const progressValueSx: SxProps<Theme> = {
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'text.primary',
};

export const headerSx: SxProps<Theme> = {
  marginBottom: '2rem',
};

export const titleSx: SxProps<Theme> = {
  fontSize: { xs: '1.5rem', md: '2rem' },
  fontWeight: 700,
  marginBottom: '0.5rem',
};

export const sectionsContainerSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
};

export const cvInfoSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
};

export const cvIconSx: SxProps<Theme> = {
  color: 'error.main',
  fontSize: '2rem',
};

export const cvTextSx: SxProps<Theme> = {
  fontSize: '0.875rem',
  color: 'text.secondary',
};

export const cvDateSx: SxProps<Theme> = {
  fontSize: '1rem',
  fontWeight: 500,
};

export const cvDownloadButtonSx: SxProps<Theme> = {
  borderColor: '#0D9488',
  color: '#0D9488',
  '&:hover': {
    borderColor: '#0f766e',
    backgroundColor: 'rgba(13, 148, 136, 0.04)',
  },
};

export const errorContainerSx: SxProps<Theme> = {
  maxWidth: '32rem',
  margin: '0 auto',
  padding: '2rem',
};
