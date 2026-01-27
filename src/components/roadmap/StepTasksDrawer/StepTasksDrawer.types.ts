import type { RoadmapStepWithTasksDTO } from '../../../types';

export interface StepTasksDrawerProps {
  open: boolean;
  step: RoadmapStepWithTasksDTO | null;
  completedTaskIds: number[];
  isToggling: boolean;
  onClose: () => void;
  onToggleTaskCompleted: (taskId: number, isCompleted: boolean) => Promise<void>;
}
