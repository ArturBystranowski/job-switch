import type { StepTaskDTO } from '../../../types';

export type NodeStatus = 'completed' | 'unlocked' | 'locked';

export interface RoadmapNodeProps {
  stepId: number;
  stepNumber: number;
  title: string;
  description: string;
  status: NodeStatus;
  tasks: StepTaskDTO[];
  completedTaskIds: number[];
  isSelected: boolean;
  onSelect: (stepId: number) => void;
}
