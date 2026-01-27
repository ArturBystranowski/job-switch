import type { SxProps, Theme } from '@mui/material';

export const nodeContainerSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'stretch',
  gap: { xs: '0.75rem', md: '1rem' },
  position: 'relative',
};

export const timelineConnectorSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
};

export const getNodeCircleSx = (status: 'completed' | 'unlocked' | 'locked'): SxProps<Theme> => {
  const baseStyles: SxProps<Theme> = {
    width: { xs: '2.5rem', md: '3rem' },
    height: { xs: '2.5rem', md: '3rem' },
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: status !== 'locked' ? 'pointer' : 'default',
    transition: 'all 0.2s ease-in-out',
    flexShrink: 0,
    '&:hover': status !== 'locked' ? { transform: 'scale(1.05)' } : {},
  };

  switch (status) {
    case 'completed':
      return {
        ...baseStyles,
        backgroundColor: '#0D9488',
        color: 'white',
      };
    case 'unlocked':
      return {
        ...baseStyles,
        backgroundColor: 'secondary.main',
        color: 'white',
        '&:hover': { backgroundColor: '#0f766e', transform: 'scale(1.05)' },
      };
    case 'locked':
      return {
        ...baseStyles,
        backgroundColor: 'grey.300',
        color: 'grey.500',
        opacity: 0.6,
      };
  }
};

export const getConnectorLineSx = (
  isLast: boolean,
  status: 'completed' | 'unlocked' | 'locked'
): SxProps<Theme> => ({
  display: isLast ? 'none' : 'block',
  width: '2px',
  flex: 1,
  minHeight: '1rem',
  backgroundColor: status === 'locked' ? 'grey.300' : status=== 'unlocked' ? 'secondary.main' : '#0D9488',
  opacity: status === 'locked' ? 0.4 : 1,
});

export const contentContainerSx: SxProps<Theme> = {
  flex: 1,
  minWidth: 0,
};

export const getNodeCardSx = (
  isSelected: boolean,
  status: 'completed' | 'unlocked' | 'locked'
): SxProps<Theme> => ({
  padding: { xs: '0.75rem', md: '1rem' },
  borderRadius: '0.75rem',
  border: '2px solid',
  borderColor: isSelected ? 'secondary.main' : 'transparent',
  backgroundColor: status === 'locked' ? 'grey.100' : 'background.paper',
  opacity: status === 'locked' ? 0.6 : 1,
  cursor: status !== 'locked' ? 'pointer' : 'default',
  transition: 'all 0.2s ease-in-out',
  '&:hover':
    status !== 'locked'
      ? {
          borderColor: 'secondary.main',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }
      : {},
});

export const nodeTitleSx: SxProps<Theme> = {
  fontSize: { xs: '0.9375rem', md: '1rem' },
  fontWeight: 600,
  color: 'text.primary',
  marginBottom: '0.25rem',
};

export const nodeDescriptionSx: SxProps<Theme> = {
  fontSize: '0.8125rem',
  color: 'text.secondary',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

export const tasksContainerSx: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  marginTop: '0.75rem',
};

export const getTaskProgressSx = (isCompleted: boolean): SxProps<Theme> => ({
  fontSize: '0.6875rem',
  fontWeight: 500,
  borderRadius: '0.25rem',
  height: '1.5rem',
  flexShrink: 0,
  alignSelf: 'flex-start',
  backgroundColor: isCompleted ? 'rgba(13, 148, 136, 0.1)' : 'grey.100',
  color: isCompleted ? '#0D9488' : 'grey.500',
  border: 'none',
  '& .MuiChip-label': {
    padding: '0 0.5rem',
  },
});
