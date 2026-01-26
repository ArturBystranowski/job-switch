export interface ErrorAlertProps {
  message: string;
  title?: string;
  onRetry?: () => void;
  onClose?: () => void;
}
