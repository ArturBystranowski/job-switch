import { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, CircularProgress, Typography, Button, Fade } from '@mui/material';
import {
  overlaySx,
  contentSx,
  messageSx,
  progressContainerSx,
} from './AILoadingOverlay.sx';
import type { AILoadingOverlayProps } from './AILoadingOverlay.types';

const LOADING_MESSAGES_WITH_CV = [
  'Analizuję Twoje CV...',
  'Dopasowuję role do Twoich preferencji...',
  'Przygotowuję rekomendacje...',
  'Już prawie gotowe...',
];

const LOADING_MESSAGES_WITHOUT_CV = [
  'Analizuję Twoje odpowiedzi...',
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
  hasCV = false,
}: AILoadingOverlayProps) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isTimedOut, setIsTimedOut] = useState(false);

  const loadingMessages = useMemo(
    () => (hasCV ? LOADING_MESSAGES_WITH_CV : LOADING_MESSAGES_WITHOUT_CV),
    [hasCV]
  );

  const handleRetry = useCallback(() => {
    setIsTimedOut(false);
    setMessageIndex(0);
    onRetry?.();
  }, [onRetry]);

  useEffect(() => {
    if (isTimedOut) return;

    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, MESSAGE_INTERVAL_MS);

    return () => clearInterval(messageTimer);
  }, [isTimedOut, loadingMessages.length]);

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
          <Typography variant='h5' color='error'>
            Wystąpił problem
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Analiza trwa zbyt długo. Spróbuj ponownie za chwilę.
          </Typography>
          {onRetry && (
            <Button variant='contained' color='primary' onClick={handleRetry}>
              Spróbuj ponownie
            </Button>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={overlaySx} data-testid='recommendations-loading'>
      <Box sx={contentSx}>
        <Box sx={progressContainerSx}>
          <CircularProgress size={80} thickness={4} color='primary' />
        </Box>
        <Box sx={messageSx}>
          <Fade in key={messageIndex} timeout={500}>
            <Typography variant='h6' color='text.primary'>
              {loadingMessages[messageIndex]}
            </Typography>
          </Fade>
        </Box>
        <Typography variant='body2' color='text.secondary'>
          To może potrwać do minuty
        </Typography>
      </Box>
    </Box>
  );
};
