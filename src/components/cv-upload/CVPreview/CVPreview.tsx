import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';
import {
  previewContainerSx,
  iconContainerSx,
  fileInfoSx,
  fileNameSx,
  fileSizeSx,
  successIconSx,
  errorIconSx,
  removeButtonSx,
} from './CVPreview.sx';
import type { CVPreviewProps } from './CVPreview.types';

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const CVPreview = ({ file, status, errorMessage, onRemove }: CVPreviewProps) => {

  const renderStatusIcon = () => {
    switch (status) {
      case 'uploading':
        return <CircularProgress size={24} />;
      case 'success':
        return <CheckCircleIcon sx={successIconSx} />;
      case 'error':
        return <ErrorIcon sx={errorIconSx} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={previewContainerSx}>
      <Box sx={iconContainerSx}>
        <PictureAsPdfIcon color="error" />
      </Box>
      <Box sx={fileInfoSx}>
        <Typography sx={fileNameSx}>{file.name}</Typography>
        <Typography sx={fileSizeSx}>
          {formatFileSize(file.size)}
          {errorMessage && status === 'error' && ` • ${errorMessage}`}
        </Typography>
      </Box>
      {renderStatusIcon()}
      {onRemove && status !== 'uploading' && status !== 'success' && (
        <IconButton size="small" onClick={onRemove} sx={removeButtonSx}>
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};
