import { useState, useEffect, useCallback } from 'react';
import { Box, CircularProgress, Typography, Button, Fade } from '@mui/material';
import {
  overlaySx,
  contentSx,
  messageSx,
  progressContainerSx,
} from './AILoadingOverlay.sx';
import type { AILoadingOverlayProps } from './AILoadingOverlay.types';

const LOADING_MESSAGES = [
  'Analizuję Twoje CV...',
  'Dopasowuję role do Twoich preferencji...',
  'Przygotowuję rekomendacje...',
  'Już prawie gotowe...',
];

const MESSAGE_INTERVAL_MS = 3500;
const DEFAULT_TIMEOUT_MS = 60000;

export const AILoadingOverlay = ({
  onTimeout,
  onRetry,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}: AILoadingOverlayProps) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isTimedOut, setIsTimedOut] = useState(false);

  const handleRetry = useCallback(() => {
    setIsTimedOut(false);
    setMessageIndex(0);
    onRetry?.();
  }, [onRetry]);

  useEffect(() => {
    if (isTimedOut) return;

    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, MESSAGE_INTERVAL_MS);

    return () => clearInterval(messageTimer);
  }, [isTimedOut]);

  useEffect(() => {
    const timeoutTimer = setTimeout(() => {
      setIsTimedOut(true);
      onTimeout?.();
    }, timeoutMs);

    return () => clearTimeout(timeoutTimer);
  }, [timeoutMs, onTimeout]);

  if (isTimedOut) {
    return (
      <Box sx={overlaySx}>
        <Box sx={contentSx}>
          <Typography variant="h5" color="error">
            Wystąpił problem
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Analiza trwa zbyt długo. Spróbuj ponownie za chwilę.
          </Typography>
          {onRetry && (
            <Button variant="contained" color="primary" onClick={handleRetry}>
              Spróbuj ponownie
            </Button>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={overlaySx}>
      <Box sx={contentSx}>
        <Box sx={progressContainerSx}>
          <CircularProgress size={80} thickness={4} color="primary" />
        </Box>
        <Box sx={messageSx}>
          <Fade in key={messageIndex} timeout={500}>
            <Typography variant="h6" color="text.primary">
              {LOADING_MESSAGES[messageIndex]}
            </Typography>
          </Fade>
        </Box>
        <Typography variant="body2" color="text.secondary">
          To może potrwać do minuty
        </Typography>
      </Box>
    </Box>
  );
};
