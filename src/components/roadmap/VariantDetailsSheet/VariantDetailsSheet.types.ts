import type { StepVariantDTO } from '../../../types';

export interface VariantDetailsSheetProps {
  open: boolean;
  variant: StepVariantDTO | null;
  stepTitle: string;
  isCompleted: boolean;
  isLoading: boolean;
  onMarkComplete: () => void;
  onClose: () => void;
}
