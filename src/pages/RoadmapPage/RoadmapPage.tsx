import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MapIcon from '@mui/icons-material/Map';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckIcon from '@mui/icons-material/Check';
import { useAuth } from '../../hooks';
import { useProfile } from '../../hooks/useProfile';
import { useRoadmap } from '../../hooks/useRoadmap';
import { useCompletedTaskIds, useToggleTaskCompleted } from '../../hooks/useProgress';
import { LoadingSpinner, ErrorAlert } from '../../components/common';
import {
  RoadmapProgressHeader,
  RoadmapTree,
  TaskDetailsPanel,
  StepTasksDrawer,
} from '../../components/roadmap';
import type { StepTaskDTO, RoadmapStepWithTasksDTO } from '../../types';
import {
  pageContainerSx,
  mainContentSx,
  treeContainerSx,
  detailsPanelContainerSx,
  errorContainerSx,
  emptyStateContainerSx,
  emptyStateTitleSx,
  emptyStateDescriptionSx,
  tasksPanelContainerSx,
  tasksPanelHeaderSx,
  tasksPanelTitleSx,
  tasksPanelSubtitleSx,
  tasksListSx,
  getTaskAccordionSx,
  taskAccordionSummarySx,
  taskAccordionSummaryContentSx,
  taskTitleSx,
  taskTimeSx,
  taskAccordionActionsSx,
  taskAccordionDetailsSx,
  taskDescriptionSx,
} from './RoadmapPage.sx';

export const RoadmapPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id ?? '';

  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const { data: profile, isPending: isProfilePending, isError: isProfileError } = useProfile();
  const roleId = profile?.selected_role_id ?? 0;
  const roleName = profile?.roles?.name ?? 'Roadmapa';

  const {
    data: roadmapSteps = [],
    isPending: isRoadmapPending,
    isError: isRoadmapError,
    error: roadmapError,
    refetch: refetchRoadmap,
  } = useRoadmap(roleId, { enabled: roleId > 0 });

  const {
    data: completedTaskIds = [],
    isPending: isProgressPending,
    refetch: refetchProgress,
  } = useCompletedTaskIds(userId, { enabled: !!userId });

  const toggleTaskCompleted = useToggleTaskCompleted();

  const selectedStep = useMemo((): RoadmapStepWithTasksDTO | null => {
    if (!selectedStepId) return null;
    return roadmapSteps.find((step) => step.id === selectedStepId) ?? null;
  }, [selectedStepId, roadmapSteps]);

  const selectedTask = useMemo((): StepTaskDTO | null => {
    if (!selectedTaskId || !selectedStep) return null;
    return selectedStep.step_tasks.find((t) => t.id === selectedTaskId) ?? null;
  }, [selectedTaskId, selectedStep]);

  const completedStepsCount = useMemo(() => {
    return roadmapSteps.filter((step) => {
      const stepTaskIds = step.step_tasks.map((t) => t.id);
      const completedCount = stepTaskIds.filter((id) => completedTaskIds.includes(id)).length;
      return completedCount === stepTaskIds.length && stepTaskIds.length > 0;
    }).length;
  }, [roadmapSteps, completedTaskIds]);

  const handleStepSelect = useCallback(
    (stepId: number) => {
      setSelectedStepId(stepId);
      setSelectedTaskId(null);
      if (isMobile) {
        setIsMobileDrawerOpen(true);
      }
    },
    [isMobile]
  );

  const handleMobileDrawerClose = useCallback(() => {
    setIsMobileDrawerOpen(false);
  }, []);

  const handleDrawerToggleTask = useCallback(
    async (taskId: number, isCompleted: boolean) => {
      await toggleTaskCompleted.mutateAsync({
        userId,
        stepTaskId: taskId,
        isCompleted,
      });
      refetchProgress();
    },
    [toggleTaskCompleted, userId, refetchProgress]
  );

  const handleMarkComplete = useCallback(async () => {
    if (!selectedTaskId) return;

    const isCurrentlyCompleted = completedTaskIds.includes(selectedTaskId);

    await toggleTaskCompleted.mutateAsync({
      userId,
      stepTaskId: selectedTaskId,
      isCompleted: isCurrentlyCompleted,
    });

    refetchProgress();
  }, [selectedTaskId, completedTaskIds, toggleTaskCompleted, userId, refetchProgress]);

  const isPending = isProfilePending || isRoadmapPending || isProgressPending;
  const isError = isProfileError || isRoadmapError;

  useEffect(() => {
    if (!isProfilePending && !profile?.selected_role_id) {
      navigate('/questionnaire', { replace: true });
    }
  }, [isProfilePending, profile?.selected_role_id, navigate]);

  if (isPending) {
    return (
      <Box sx={pageContainerSx}>
        <LoadingSpinner message="Ładowanie roadmapy..." fullScreen />
      </Box>
    );
  }

  if (!profile?.selected_role_id) {
    return (
      <Box sx={pageContainerSx}>
        <LoadingSpinner message="Przekierowywanie..." fullScreen />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={pageContainerSx}>
        <Box sx={errorContainerSx}>
          <ErrorAlert
            title="Błąd ładowania"
            message={roadmapError?.message ?? 'Nie udało się załadować roadmapy'}
            onRetry={() => refetchRoadmap()}
          />
        </Box>
      </Box>
    );
  }

  if (roadmapSteps.length === 0) {
    return (
      <Box sx={pageContainerSx}>
        <RoadmapProgressHeader
          completedSteps={0}
          totalSteps={0}
          roleName={roleName}
          userEmail={user?.email}
        />
        <Box sx={emptyStateContainerSx}>
          <MapIcon sx={{ fontSize: '4rem', color: 'grey.400', mb: 2 }} />
          <Typography sx={emptyStateTitleSx}>Brak dostępnych kroków</Typography>
          <Typography sx={emptyStateDescriptionSx}>
            Roadmapa dla tej roli nie jest jeszcze dostępna
          </Typography>
        </Box>
      </Box>
    );
  }

  const isTaskCompleted = selectedTaskId
    ? completedTaskIds.includes(selectedTaskId)
    : false;

  return (
    <Box sx={pageContainerSx}>
      <RoadmapProgressHeader
        completedSteps={completedStepsCount}
        totalSteps={roadmapSteps.length}
        roleName={roleName}
        userEmail={user?.email}
      />
      <Box sx={mainContentSx}>
        <Box sx={treeContainerSx}>
          <RoadmapTree
            steps={roadmapSteps}
            completedTaskIds={completedTaskIds}
            selectedStepId={selectedStepId}
            onStepSelect={handleStepSelect}
          />
        </Box>

        {!isMobile && (
          <Box sx={detailsPanelContainerSx}>
            {selectedStep && !selectedTaskId ? (
              <Box sx={tasksPanelContainerSx}>
                <Box sx={tasksPanelHeaderSx}>
                  <Typography sx={tasksPanelTitleSx}>{selectedStep.title}</Typography>
                  <Typography sx={tasksPanelSubtitleSx}>
                    {selectedStep.description}
                  </Typography>
                </Box>
                <Box sx={tasksListSx}>
                  {selectedStep.step_tasks.map((task) => {
                    const isCompleted = completedTaskIds.includes(task.id);
                    return (
                      <Accordion
                        key={task.id}
                        sx={getTaskAccordionSx(isCompleted)}
                        disableGutters
                        elevation={0}
                      >
                        <AccordionSummary sx={taskAccordionSummarySx} expandIcon={null}>
                          <Box sx={taskAccordionSummaryContentSx}>
                            <Stack direction="row" alignItems="center" spacing={1} flex={1}>
                              <Box
                                component="span"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleTaskCompleted
                                    .mutateAsync({
                                      userId,
                                      stepTaskId: task.id,
                                      isCompleted,
                                    })
                                    .then(() => refetchProgress());
                                }}
                                sx={{
                                  width: '1.125rem',
                                  height: '1.125rem',
                                  borderRadius: '0.25rem',
                                  border: '2px solid',
                                  borderColor: isCompleted ? '#0D9488' : 'grey.400',
                                  backgroundColor: isCompleted ? '#0D9488' : 'transparent',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  flexShrink: 0,
                                  transition: 'all 0.15s ease',
                                  '&:hover': {
                                    borderColor: '#0D9488',
                                  },
                                }}
                              >
                                {isCompleted && (
                                  <CheckIcon sx={{ color: 'white', fontSize: '0.875rem' }} />
                                )}
                              </Box>
                              <Typography sx={taskTitleSx}>{task.title}</Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              {task.estimated_hours && (
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={0.5}
                                  sx={taskTimeSx}
                                >
                                  <AccessTimeIcon sx={{ fontSize: '1rem' }} />
                                  <Typography variant="body2">{task.estimated_hours}h</Typography>
                                </Stack>
                              )}
                            </Stack>
                          </Box>
                          <Box sx={taskAccordionActionsSx}>
                            <IconButton size="small" aria-label="Rozwiń/Zwiń">
                              <ExpandMoreIcon sx={{ transition: 'transform 0.2s' }} />
                            </IconButton>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={taskAccordionDetailsSx}>
                          <Typography sx={taskDescriptionSx}>
                            {task.description ?? 'Brak opisu zadania.'}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
                <Typography
                  sx={{ fontSize: '0.8125rem', color: 'text.secondary', mt: '1rem' }}
                >
                  Wykonaj wszystkie zadania, aby odblokować następny krok
                </Typography>
                </Box>
              </Box>
            ) : (
              <TaskDetailsPanel
                task={selectedTask}
                stepTitle={selectedStep?.title ?? ''}
                isCompleted={isTaskCompleted}
                isLoading={toggleTaskCompleted.isPending}
                onMarkComplete={handleMarkComplete}
              />
            )}
          </Box>
        )}
      </Box>

      {isMobile && (
        <StepTasksDrawer
          open={isMobileDrawerOpen}
          step={selectedStep}
          completedTaskIds={completedTaskIds}
          isToggling={toggleTaskCompleted.isPending}
          onClose={handleMobileDrawerClose}
          onToggleTaskCompleted={handleDrawerToggleTask}
        />
      )}
    </Box>
  );
};
