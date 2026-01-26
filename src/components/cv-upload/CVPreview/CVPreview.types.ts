export interface CVPreviewProps {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
  onRemove?: () => void;
}
