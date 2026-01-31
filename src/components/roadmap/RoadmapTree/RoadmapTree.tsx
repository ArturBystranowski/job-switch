import { useMemo } from 'react';
import { Stack } from '@mui/material';
import { RoadmapNode } from '../RoadmapNode';
import type { NodeStatus } from '../RoadmapNode';
import { treeContainerSx } from './RoadmapTree.sx';
import type { RoadmapTreeProps } from './RoadmapTree.types';

export const RoadmapTree = ({
  steps,
  completedTaskIds,
  selectedStepId,
  onStepSelect,
}: RoadmapTreeProps) => {
  const stepsWithStatus = useMemo(() => {
    const isStepCompleted = (stepIndex: number): boolean => {
      const step = steps[stepIndex];
      if (!step) return false;
      const stepTaskIds = step.step_tasks.map((t) => t.id);
      const completedCount = stepTaskIds.filter((id) =>
        completedTaskIds.includes(id)
      ).length;
      return completedCount === stepTaskIds.length && stepTaskIds.length > 0;
    };

    const areAllPreviousStepsCompleted = (currentIndex: number): boolean => {
      for (let i = 0; i < currentIndex; i++) {
        if (!isStepCompleted(i)) {
          return false;
        }
      }
      return true;
    };

    return steps.map((step, index) => {
      const allPreviousCompleted = areAllPreviousStepsCompleted(index);
      const currentStepCompleted = isStepCompleted(index);

      let status: NodeStatus;

      if (!allPreviousCompleted) {
        status = 'locked';
      } else if (currentStepCompleted) {
        status = 'completed';
      } else {
        status = 'unlocked';
      }

      return { ...step, status };
    });
  }, [steps, completedTaskIds]);

  return (
    <Stack sx={treeContainerSx} data-testid='roadmap-container'>
      {stepsWithStatus.map((step, index) => (
        <RoadmapNode
          key={step.id}
          stepId={step.id}
          stepNumber={step.order_number}
          title={step.title}
          description={step.description}
          status={step.status}
          tasks={step.step_tasks}
          completedTaskIds={completedTaskIds}
          isSelected={selectedStepId === step.id}
          onSelect={onStepSelect}
          isLast={index === stepsWithStatus.length - 1}
        />
      ))}
    </Stack>
  );
};
