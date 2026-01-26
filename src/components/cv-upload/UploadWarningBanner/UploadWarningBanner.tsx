import { Alert, AlertTitle } from '@mui/material';
import { bannerSx } from './UploadWarningBanner.sx';

export const UploadWarningBanner = () => {
  return (
    <Alert severity="warning" sx={bannerSx}>
      <AlertTitle>Ważne</AlertTitle>
      CV można przesłać tylko raz. Upewnij się, że wybrany plik jest aktualny i poprawny.
    </Alert>
  );
};
