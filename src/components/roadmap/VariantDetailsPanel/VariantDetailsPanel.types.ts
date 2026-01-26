import type { StepVariantDTO } from '../../../types';

export interface VariantDetailsPanelProps {
  variant: StepVariantDTO | null;
  stepTitle: string;
  isCompleted: boolean;
  isLoading: boolean;
  onMarkComplete: () => void;
  onClose?: () => void;
}
