import type { RoadmapStepWithTasksDTO } from '../../../types';

export interface RoadmapTreeProps {
  steps: RoadmapStepWithTasksDTO[];
  completedTaskIds: number[];
  selectedStepId: number | null;
  onStepSelect: (stepId: number) => void;
}
