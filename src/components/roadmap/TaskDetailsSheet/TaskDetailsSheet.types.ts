import type { StepTaskDTO } from '../../../types';

export interface TaskDetailsSheetProps {
  open: boolean;
  task: StepTaskDTO | null;
  stepTitle: string;
  isCompleted: boolean;
  isLoading: boolean;
  onMarkComplete: () => void;
  onClose: () => void;
}
