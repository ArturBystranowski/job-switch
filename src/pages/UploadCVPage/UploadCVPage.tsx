import { useState, useCallback, useEffect } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAuth } from '../../hooks';
import { useCVStatus, useUploadCV, useValidateCV } from '../../hooks/useCV';
import { CVDropzone, CVPreview, UploadWarningBanner } from '../../components/cv-upload';
import { LoadingSpinner, ErrorAlert } from '../../components/common';
import {
  pageContainerSx,
  contentContainerSx,
  headerSx,
  titleSx,
  subtitleSx,
  uploadSectionSx,
  previewSectionSx,
  actionsSx,
  nextButtonSx,
  skipButtonSx,
} from './UploadCVPage.sx';

type UploadStatus = 'pending' | 'uploading' | 'success' | 'error';

export const UploadCVPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id ?? '';
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('pending');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const { data: hasCV, isPending: isCheckingCV } = useCVStatus(userId);
  const uploadCV = useUploadCV();
  const { validate } = useValidateCV();

  const handleFileSelect = useCallback(
    (file: File) => {
      const validation = validate(file);
      if (!validation.valid) {
        setSelectedFile(file);
        setUploadStatus('error');
        setErrorMessage(validation.error);
        return;
      }
      setSelectedFile(file);
      setUploadStatus('pending');
      setErrorMessage(undefined);
    },
    [validate]
  );

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    setUploadStatus('pending');
    setErrorMessage(undefined);
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    setUploadStatus('uploading');
    setErrorMessage(undefined);

    try {
      await uploadCV.mutateAsync({ userId, file: selectedFile });
      setUploadStatus('success');
    } catch (err) {
      setUploadStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Upload failed');
    }
  }, [selectedFile, userId, uploadCV]);

  const handleNext = useCallback(() => {
    navigate('/recommendations');
  }, [navigate]);

  useEffect(() => {
    if (hasCV) {
      navigate('/recommendations');
    }
  }, [hasCV, navigate]);

  if (isCheckingCV || hasCV) {
    return (
      <Box sx={pageContainerSx}>
        <LoadingSpinner message="Sprawdzanie statusu CV..." fullScreen />
      </Box>
    );
  }

  return (
    <Box sx={pageContainerSx}>
      <Container maxWidth="sm" sx={contentContainerSx}>
        <Box sx={headerSx}>
          <Typography sx={titleSx}>Prześlij swoje CV</Typography>
          <Typography sx={subtitleSx}>
            Twoje CV pomoże nam lepiej dopasować rekomendacje do Twojego doświadczenia
          </Typography>
        </Box>

        <UploadWarningBanner />

        {!selectedFile && (
          <Box sx={uploadSectionSx}>
            <CVDropzone onFileSelect={handleFileSelect} />
          </Box>
        )}

        {selectedFile && (
          <Box sx={previewSectionSx}>
            <CVPreview
              file={selectedFile}
              status={uploadStatus}
              errorMessage={errorMessage}
              onRemove={uploadStatus !== 'success' ? handleRemoveFile : undefined}
            />
          </Box>
        )}

        {uploadStatus === 'error' && errorMessage && (
          <Box sx={{ marginBottom: '1.5rem' }}>
            <ErrorAlert message={errorMessage} onRetry={handleRemoveFile} />
          </Box>
        )}

        <Box sx={actionsSx}>
          {uploadStatus === 'success' ? (
            <Button
              variant="contained"
              size="large"
              onClick={handleNext}
              endIcon={<ArrowForwardIcon />}
              sx={nextButtonSx}
            >
              Dalej
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                size="large"
                onClick={handleUpload}
                disabled={!selectedFile || uploadStatus === 'uploading' || uploadStatus === 'error'}
                sx={nextButtonSx}
              >
                {uploadStatus === 'uploading' ? 'Przesyłanie...' : 'Prześlij CV'}
              </Button>
              <Button
                variant="text"
                size="small"
                onClick={handleNext}
                sx={skipButtonSx}
              >
                Pomiń ten krok
              </Button>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};
