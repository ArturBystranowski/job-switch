import type { SxProps, Theme } from '@mui/material';

export const getTaskChipSx = (isCompleted: boolean): SxProps<Theme> => ({
  cursor: 'pointer',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: isCompleted ? 'success.main' : 'grey.300',
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
