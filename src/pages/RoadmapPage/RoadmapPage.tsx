import { useState, useMemo, useCallback } from 'react';
import { Box, Typography, Button, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MapIcon from '@mui/icons-material/Map';
import { useDevUser } from '../../context';
import { useProfile } from '../../hooks/useProfile';
import { useRoadmap } from '../../hooks/useRoadmap';
import { useCompletedVariantIds, useToggleVariantCompleted } from '../../hooks/useProgress';
import { LoadingSpinner, ErrorAlert } from '../../components/common';
import {
  RoadmapProgressHeader,
  RoadmapTree,
  VariantDetailsPanel,
  VariantDetailsSheet,
} from '../../components/roadmap';
import type { StepVariantDTO, RoadmapStepWithVariantsDTO } from '../../types';
import {
  pageContainerSx,
  mainContentSx,
  treeContainerSx,
  detailsPanelContainerSx,
  errorContainerSx,
  emptyStateContainerSx,
  emptyStateTitleSx,
  emptyStateDescriptionSx,
} from './RoadmapPage.sx';

export const RoadmapPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const navigate = useNavigate();
  const { userId } = useDevUser();

  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

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
    data: completedVariantIds = [],
    isPending: isProgressPending,
    refetch: refetchProgress,
  } = useCompletedVariantIds(userId, { enabled: !!userId });

  const toggleVariantCompleted = useToggleVariantCompleted();

  const selectedVariant = useMemo((): StepVariantDTO | null => {
    if (!selectedVariantId) return null;
    for (const step of roadmapSteps) {
      const variant = step.step_variants.find((v) => v.id === selectedVariantId);
      if (variant) return variant;
    }
    return null;
  }, [selectedVariantId, roadmapSteps]);

  const selectedStep = useMemo((): RoadmapStepWithVariantsDTO | null => {
    if (!selectedVariantId) return null;
    return roadmapSteps.find((step) =>
      step.step_variants.some((v) => v.id === selectedVariantId)
    ) ?? null;
  }, [selectedVariantId, roadmapSteps]);

  const completedStepsCount = useMemo(() => {
    return roadmapSteps.filter((step) =>
      step.step_variants.some((v) => completedVariantIds.includes(v.id))
    ).length;
  }, [roadmapSteps, completedVariantIds]);

  const handleStepSelect = useCallback((stepId: number) => {
    setSelectedStepId(stepId);
  }, []);

  const handleVariantSelect = useCallback(
    (variantId: number) => {
      setSelectedVariantId(variantId);
      if (isMobile) {
        setIsMobileSheetOpen(true);
      }
    },
    [isMobile]
  );

  const handleMobileSheetClose = useCallback(() => {
    setIsMobileSheetOpen(false);
  }, []);

  const handleMarkComplete = useCallback(async () => {
    if (!selectedVariantId) return;

    const isCurrentlyCompleted = completedVariantIds.includes(selectedVariantId);

    await toggleVariantCompleted.mutateAsync({
      userId,
      stepVariantId: selectedVariantId,
      isCompleted: isCurrentlyCompleted,
    });

    refetchProgress();
  }, [selectedVariantId, completedVariantIds, toggleVariantCompleted, userId, refetchProgress]);

  const isPending = isProfilePending || isRoadmapPending || isProgressPending;
  const isError = isProfileError || isRoadmapError;

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
        <Box sx={emptyStateContainerSx}>
          <MapIcon sx={{ fontSize: '4rem', color: 'grey.400', mb: 2 }} />
          <Typography sx={emptyStateTitleSx}>Nie wybrano jeszcze roli</Typography>
          <Typography sx={emptyStateDescriptionSx}>
            Aby zobaczyć roadmapę, najpierw wybierz swoją rolę w IT
          </Typography>
          <Button variant="contained" onClick={() => navigate('/recommendations')}>
            Wybierz rolę
          </Button>
        </Box>
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

  const isVariantCompleted = selectedVariantId
    ? completedVariantIds.includes(selectedVariantId)
    : false;

  return (
    <Box sx={pageContainerSx}>
      <RoadmapProgressHeader
        completedSteps={completedStepsCount}
        totalSteps={roadmapSteps.length}
        roleName={roleName}
      />
      <Box sx={mainContentSx}>
        <Box sx={treeContainerSx}>
          <RoadmapTree
            steps={roadmapSteps}
            completedVariantIds={completedVariantIds}
            selectedStepId={selectedStepId}
            onStepSelect={handleStepSelect}
            onVariantSelect={handleVariantSelect}
          />
        </Box>
        <Box sx={detailsPanelContainerSx}>
          <VariantDetailsPanel
            variant={selectedVariant}
            stepTitle={selectedStep?.title ?? ''}
            isCompleted={isVariantCompleted}
            isLoading={toggleVariantCompleted.isPending}
            onMarkComplete={handleMarkComplete}
          />
        </Box>
      </Box>

      {isMobile && (
        <VariantDetailsSheet
          open={isMobileSheetOpen}
          variant={selectedVariant}
          stepTitle={selectedStep?.title ?? ''}
          isCompleted={isVariantCompleted}
          isLoading={toggleVariantCompleted.isPending}
          onMarkComplete={handleMarkComplete}
          onClose={handleMobileSheetClose}
        />
      )}
    </Box>
  );
};
