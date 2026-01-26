import { Box, CircularProgress, Typography } from '@mui/material';
import { containerSx, fullScreenSx } from './LoadingSpinner.sx';
import type { LoadingSpinnerProps } from './LoadingSpinner.types';

export const LoadingSpinner = ({
  size = 40,
  message,
  fullScreen = false,
}: LoadingSpinnerProps) => {
  return (
    <Box sx={fullScreen ? fullScreenSx : containerSx}>
      <CircularProgress size={size} color="primary" />
      {message && (
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
};
