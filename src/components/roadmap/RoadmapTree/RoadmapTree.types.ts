import type { RoadmapStepWithVariantsDTO } from '../../../types';

export interface RoadmapTreeProps {
  steps: RoadmapStepWithVariantsDTO[];
  completedVariantIds: number[];
  selectedStepId: number | null;
  onStepSelect: (stepId: number) => void;
  onVariantSelect: (variantId: number) => void;
}
