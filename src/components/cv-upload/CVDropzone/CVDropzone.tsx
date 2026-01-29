import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  dropzoneSx,
  dropzoneActiveSx,
  dropzoneDisabledSx,
  iconContainerSx,
  uploadIconSx,
  titleSx,
  subtitleSx,
  constraintsSx,
} from './CVDropzone.sx';
import type { CVDropzoneProps } from './CVDropzone.types';

export const CVDropzone = ({
  onFileSelect,
  disabled = false,
  maxSizeMB = 3,
}: CVDropzoneProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxSize: maxSizeMB * 1024 * 1024,
    multiple: false,
    disabled,
  });

  const getDropzoneSx = () => {
    if (disabled) return dropzoneDisabledSx;
    if (isDragActive) return dropzoneActiveSx;
    return dropzoneSx;
  };

  return (
    <Box {...getRootProps()} sx={getDropzoneSx()} data-testid='cv-dropzone'>
      <input {...getInputProps()} data-testid='cv-file-input' />
      <Box sx={iconContainerSx}>
        <CloudUploadIcon sx={uploadIconSx} />
      </Box>
      <Typography sx={titleSx}>
        {isDragActive ? 'Upuść plik tutaj' : 'Przeciągnij i upuść plik CV'}
      </Typography>
      <Typography sx={subtitleSx}>lub kliknij aby wybrać plik</Typography>
      <Typography sx={constraintsSx}>
        Maksymalnie {maxSizeMB}MB, tylko PDF
      </Typography>
    </Box>
  );
};
