import type { SxProps, Theme } from '@mui/material';

export const getVariantChipSx = (
  isCompleted: boolean,
  isRecommended: boolean
): SxProps<Theme> => ({
  cursor: 'pointer',
  borderWidth: isRecommended ? '2px' : '1px',
  borderStyle: 'solid',
  borderColor: isCompleted
    ? 'success.main'
    : isRecommended
      ? 'primary.main'
      : 'grey.300',
  backgroundColor: isCompleted ? 'success.light' : 'background.paper',
  color: isCompleted ? 'success.dark' : 'text.primary',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: isCompleted ? 'success.light' : 'primary.light',
    borderColor: isCompleted ? 'success.main' : 'primary.main',
    color: isCompleted ? 'success.dark' : 'primary.dark',
  },
  '& .MuiChip-icon': {
    color: 'inherit',
  },
});
