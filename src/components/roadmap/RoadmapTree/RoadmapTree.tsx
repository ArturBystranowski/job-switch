import { useMemo } from 'react';
import { Stack } from '@mui/material';
import { RoadmapNode } from '../RoadmapNode';
import type { NodeStatus } from '../RoadmapNode';
import { treeContainerSx } from './RoadmapTree.sx';
import type { RoadmapTreeProps } from './RoadmapTree.types';

export const RoadmapTree = ({
  steps,
  completedVariantIds,
  selectedStepId,
  onStepSelect,
  onVariantSelect,
}: RoadmapTreeProps) => {
  const stepsWithStatus = useMemo(() => {
    return steps.map((step, index) => {
      const stepVariantIds = step.step_variants.map((v) => v.id);
      const hasCompletedVariant = stepVariantIds.some((id) =>
        completedVariantIds.includes(id)
      );

      let status: NodeStatus;

      if (hasCompletedVariant) {
        status = 'completed';
      } else if (index === 0) {
        status = 'unlocked';
      } else {
        const previousStep = steps[index - 1];
        const previousStepVariantIds = previousStep.step_variants.map((v) => v.id);
        const previousStepHasCompleted = previousStepVariantIds.some((id) =>
          completedVariantIds.includes(id)
        );
        status = previousStepHasCompleted ? 'unlocked' : 'locked';
      }

      return { ...step, status };
    });
  }, [steps, completedVariantIds]);

  return (
    <Stack sx={treeContainerSx}>
      {stepsWithStatus.map((step, index) => (
        <RoadmapNode
          key={step.id}
          stepId={step.id}
          stepNumber={step.order_number}
          title={step.title}
          description={step.description}
          status={step.status}
          variants={step.step_variants}
          completedVariantIds={completedVariantIds}
          isSelected={selectedStepId === step.id}
          onSelect={onStepSelect}
          onVariantSelect={onVariantSelect}
          isLast={index === stepsWithStatus.length - 1}
        />
      ))}
    </Stack>
  );
};
