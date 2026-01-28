export interface AILoadingOverlayProps {
  onTimeout?: () => void;
  onRetry?: () => void;
  timeoutMs?: number;
  hasCV?: boolean;
}
