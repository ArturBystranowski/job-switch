import { useState, useCallback } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useAuth } from '../../hooks';
import { useProfile, useSelectRole } from '../../hooks/useProfile';
import { useGenerateRecommendation } from '../../hooks/useRecommendation';
import { RoleCard, RoleConfirmationDialog } from '../../components/recommendations';
import { LoadingSpinner, ErrorAlert, AILoadingOverlay } from '../../components/common';
import type { AIRecommendationsDTO } from '../../types';
import {
  pageContainerSx,
  contentContainerSx,
  headerSx,
  titleSx,
  subtitleSx,
  cardsContainerSx,
  errorContainerSx,
  generateContainerSx,
  generateTitleSx,
  generateDescriptionSx,
} from './RecommendationsPage.sx';

interface SelectedRole {
  roleId: number;
  roleName: string;
}

export const RecommendationsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id ?? '';
  const [selectedRole, setSelectedRole] = useState<SelectedRole | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: profile, isPending, isError, error, refetch } = useProfile();
  const selectRole = useSelectRole();
  const generateRecommendation = useGenerateRecommendation();

  const aiRecommendations = profile?.ai_recommendations as AIRecommendationsDTO | null;
  const recommendations = aiRecommendations?.recommendations ?? [];
  const hasRecommendations = recommendations.length > 0;
  const hasSelectedRole = !!profile?.selected_role_id;
  const hasCV = !!profile?.cv_uploaded_at;

  const handleSelectRole = useCallback((roleId: number, roleName: string) => {
    setSelectedRole({ roleId, roleName });
    setIsDialogOpen(true);
  }, []);

  const handleCancelDialog = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedRole(null);
  }, []);

  const handleConfirmRole = useCallback(async () => {
    if (!selectedRole) return;

    try {
      await selectRole.mutateAsync({
        userId,
        roleId: selectedRole.roleId,
      });
      setIsDialogOpen(false);
      // Wait for profile cache to be updated before navigating
      await refetch();
      navigate('/roadmap');
    } catch (err) {
      console.error('Failed to select role:', err);
    }
  }, [selectedRole, userId, selectRole, navigate, refetch]);

  const handleGenerateRecommendations = useCallback(async () => {
    try {
      await generateRecommendation.mutateAsync({ userId });
      refetch();
    } catch (err) {
      console.error('Failed to generate recommendations:', err);
    }
  }, [generateRecommendation, refetch, userId]);

  if (generateRecommendation.isPending) {
    return <AILoadingOverlay onRetry={handleGenerateRecommendations} hasCV={hasCV} />;
  }

  if (isPending) {
    return (
      <Box sx={pageContainerSx}>
        <LoadingSpinner message="Ładowanie rekomendacji..." fullScreen />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={pageContainerSx}>
        <Box sx={errorContainerSx}>
          <ErrorAlert
            title="Błąd ładowania"
            message={error?.message ?? 'Nie udało się załadować rekomendacji'}
            onRetry={() => refetch()}
          />
        </Box>
      </Box>
    );
  }

  if (hasSelectedRole) {
    navigate('/roadmap');
    return null;
  }

  if (!hasRecommendations) {
    return (
      <Box sx={pageContainerSx}>
        <Container maxWidth="md" sx={contentContainerSx}>
          <Box sx={generateContainerSx}>
            <AutoAwesomeIcon sx={{ fontSize: '3rem', color: 'primary.main', mb: 2 }} />
            <Typography sx={generateTitleSx}>
              Czas na analizę AI
            </Typography>
            <Typography sx={generateDescriptionSx}>
              Na podstawie Twoich odpowiedzi i CV przygotujemy spersonalizowane
              rekomendacje ról w IT.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleGenerateRecommendations}
              startIcon={<AutoAwesomeIcon />}
              disabled={generateRecommendation.isPending}
            >
              Generuj rekomendacje
            </Button>
            {generateRecommendation.isError && (
              <Box sx={{ mt: 2 }}>
                <ErrorAlert
                  message={
                    generateRecommendation.error?.message ??
                    'Nie udało się wygenerować rekomendacji'
                  }
                  onRetry={handleGenerateRecommendations}
                />
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={pageContainerSx}>
      <Container maxWidth="lg" sx={contentContainerSx}>
        <Box sx={headerSx}>
          <Typography sx={titleSx}>Twoje rekomendowane ścieżki kariery</Typography>
          <Typography sx={subtitleSx}>
            Na podstawie Twoich odpowiedzi i CV przygotowaliśmy dla Ciebie propozycje
          </Typography>
        </Box>

        <Box sx={cardsContainerSx}>
          {recommendations.map((rec, index) => (
            <RoleCard
              key={rec.role_id}
              roleId={rec.role_id}
              roleName={rec.role_name}
              justification={rec.justification}
              variant={index === 0 ? 'recommended' : 'alternative'}
              onSelect={(roleId) => handleSelectRole(roleId, rec.role_name)}
              disabled={selectRole.isPending}
            />
          ))}
        </Box>
      </Container>

      {selectedRole && (
        <RoleConfirmationDialog
          open={isDialogOpen}
          roleName={selectedRole.roleName}
          onConfirm={handleConfirmRole}
          onCancel={handleCancelDialog}
          isLoading={selectRole.isPending}
        />
      )}
    </Box>
  );
};
