import { Alert, AlertTitle, Button, Stack } from '@mui/material';
import { alertSx, actionSx } from './ErrorAlert.sx';
import type { ErrorAlertProps } from './ErrorAlert.types';

export const ErrorAlert = ({ message, title, onRetry, onClose }: ErrorAlertProps) => {
  return (
    <Alert
      severity="error"
      sx={alertSx}
      onClose={onClose}
      action={
        onRetry ? (
          <Stack sx={actionSx}>
            <Button color="error" size="small" onClick={onRetry}>
              Spróbuj ponownie
            </Button>
          </Stack>
        ) : undefined
      }
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {message}
    </Alert>
  );
};
