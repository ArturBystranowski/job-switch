import { Box, Container, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import LockIcon from '@mui/icons-material/Lock';
import { useProfile } from '../../hooks/useProfile';
import { useUserProgress } from '../../hooks/useProgress';
import { useDevUser } from '../../context';
import {
  ProfileSection,
  QuestionnaireAnswers,
  SelectedRoleCard,
  ProgressSummary,
} from '../../components/profile';
import { LoadingSpinner, ErrorAlert } from '../../components/common';
import type { QuestionnaireResponsesDTO, AIRecommendationsDTO } from '../../types';
import {
  pageContainerSx,
  contentContainerSx,
  headerSx,
  titleSx,
  readOnlyNoticeSx,
  readOnlyTextSx,
  sectionsContainerSx,
  cvInfoSx,
  cvIconSx,
  cvTextSx,
  cvDateSx,
  errorContainerSx,
} from './ProfilePage.sx';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { userId } = useDevUser();
  const { data: profile, isPending, isError, error, refetch } = useProfile();
  const { data: progressData } = useUserProgress(userId);

  const handleNavigateToRoadmap = () => {
    navigate('/roadmap');
  };

  if (isPending) {
    return (
      <Box sx={pageContainerSx}>
        <LoadingSpinner message="Ładowanie profilu..." fullScreen />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={pageContainerSx}>
        <Box sx={errorContainerSx}>
          <ErrorAlert
            title="Błąd ładowania"
            message={error?.message ?? 'Nie udało się załadować profilu'}
            onRetry={() => refetch()}
          />
        </Box>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={pageContainerSx}>
        <Box sx={errorContainerSx}>
          <ErrorAlert title="Brak danych" message="Nie znaleziono profilu" />
        </Box>
      </Box>
    );
  }

  const questionnaireResponses = profile.questionnaire_responses as QuestionnaireResponsesDTO | null;
  const aiRecommendations = profile.ai_recommendations as AIRecommendationsDTO | null;
  const selectedRoleId = profile.selected_role_id;
  const selectedRole = profile.roles;
  const cvUploadedAt = profile.cv_uploaded_at;

  const selectedRecommendation = aiRecommendations?.recommendations.find(
    (rec) => rec.role_id === selectedRoleId
  );

  const completedSteps = progressData?.length ?? 0;
  const totalSteps = 10;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <Box sx={pageContainerSx}>
      <Container maxWidth="md" sx={contentContainerSx}>
        <Box sx={headerSx}>
          <Typography sx={titleSx}>Twój profil</Typography>
          {selectedRoleId && (
            <Box sx={readOnlyNoticeSx}>
              <Stack direction="row" spacing={1} alignItems="center">
                <LockIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                <Typography sx={readOnlyTextSx}>
                  Wybór roli jest ostateczny. Przeglądasz historyczne dane.
                </Typography>
              </Stack>
            </Box>
          )}
        </Box>

        <Stack sx={sectionsContainerSx}>
          <ProfileSection title="Twoje odpowiedzi">
            <QuestionnaireAnswers responses={questionnaireResponses} />
          </ProfileSection>

          {selectedRole && (
            <ProfileSection title="Wybrana rola">
              <SelectedRoleCard
                roleName={selectedRole.name}
                justification={selectedRecommendation?.justification}
              />
            </ProfileSection>
          )}

          {cvUploadedAt && (
            <ProfileSection title="CV">
              <Box sx={cvInfoSx}>
                <PictureAsPdfIcon sx={cvIconSx} />
                <Box>
                  <Typography sx={cvDateSx}>cv.pdf</Typography>
                  <Typography sx={cvTextSx}>
                    Przesłano {formatDate(cvUploadedAt)}
                  </Typography>
                </Box>
              </Box>
            </ProfileSection>
          )}

          {selectedRoleId && (
            <ProfileSection title="Postęp">
              <ProgressSummary
                completedSteps={completedSteps}
                totalSteps={totalSteps}
                onNavigateToRoadmap={handleNavigateToRoadmap}
              />
            </ProfileSection>
          )}
        </Stack>
      </Container>
    </Box>
  );
};
