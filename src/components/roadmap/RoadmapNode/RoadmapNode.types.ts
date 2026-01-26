import type { StepVariantDTO } from '../../../types';

export type NodeStatus = 'completed' | 'unlocked' | 'locked';

export interface RoadmapNodeProps {
  stepId: number;
  stepNumber: number;
  title: string;
  description: string;
  status: NodeStatus;
  variants: StepVariantDTO[];
  completedVariantIds: number[];
  isSelected: boolean;
  onSelect: (stepId: number) => void;
  onVariantSelect: (variantId: number) => void;
}
