import type { StepTaskDTO } from '../../../types';

export interface TaskDetailsPanelProps {
  task: StepTaskDTO | null;
  stepTitle: string;
  isCompleted: boolean;
  isLoading: boolean;
  onMarkComplete: () => void;
  onClose?: () => void;
}
