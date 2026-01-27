import { useState, useMemo } from 'react';
import { Box, Container, Typography, Stack, Button, CircularProgress, Tooltip, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import LockIcon from '@mui/icons-material/Lock';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WorkIcon from '@mui/icons-material/Work';
import { useProfile } from '../../hooks/useProfile';
import { useCompletedTaskIds } from '../../hooks/useProgress';
import { useRoadmap } from '../../hooks/useRoadmap';
import { useDevUser } from '../../context';
import { cvApi } from '../../api/cv.api';
import {
  ProfileSection,
  QuestionnaireAnswers,
} from '../../components/profile';
import { LoadingSpinner, ErrorAlert } from '../../components/common';
import { getAvatarUrl } from '../../utils/avatars';
import type { QuestionnaireResponsesDTO, AIRecommendationsDTO } from '../../types';
import {
  pageContainerSx,
  contentContainerSx,
  headerSx,
  titleSx,
  roleCardLockSx,
  sectionsContainerSx,
  cvInfoSx,
  cvIconSx,
  cvTextSx,
  cvDateSx,
  errorContainerSx,
  topSectionSx,
  roleSectionSx,
  progressSectionSx,
  roleCardSx,
  roleNameSx,
  roleJustificationSx,
  progressContainerSx,
  progressCircleBoxSx,
  progressInfoSx,
  progressLabelSx,
  progressValueSx,
  cvDownloadButtonSx,
  roleSectionLabelSx,
  roleCardHeaderSx,
  roleAvatarSx,
  getProgressPercentageSx,
} from './ProfilePage.sx';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { userId } = useDevUser();
  const { data: profile, isPending, isError, error, refetch } = useProfile();
  const [isDownloading, setIsDownloading] = useState(false);
  
  const selectedRoleId = profile?.selected_role_id ?? 0;
  const { data: completedTaskIds } = useCompletedTaskIds(userId);
  const { data: roadmapData } = useRoadmap(selectedRoleId);

  const { completedSteps, totalSteps } = useMemo(() => {
    if (!roadmapData || !completedTaskIds) {
      return { completedSteps: 0, totalSteps: 10 };
    }
    
    const completedSet = new Set(completedTaskIds);
    let completed = 0;
    
    for (const step of roadmapData) {
      const stepTaskIds = step.step_tasks.map(task => task.id);
      const allTasksCompleted = stepTaskIds.length > 0 && 
        stepTaskIds.every(taskId => completedSet.has(taskId));
      if (allTasksCompleted) {
        completed++;
      }
    }
    
    return { completedSteps: completed, totalSteps: roadmapData.length };
  }, [roadmapData, completedTaskIds]);

  const handleNavigateToRoadmap = () => {
    navigate('/roadmap');
  };

  const handleDownloadCV = async () => {
    if (!userId) return;
    
    setIsDownloading(true);
    try {
      const { signedURL } = await cvApi.getCVDownloadUrl(userId);
      window.open(signedURL, '_blank');
    } catch (err) {
      console.error('Failed to download CV:', err);
    } finally {
      setIsDownloading(false);
    }
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
  const selectedRole = profile.roles;
  const cvUploadedAt = profile.cv_uploaded_at;

  const selectedRecommendation = aiRecommendations?.recommendations.find(
    (rec) => rec.role_id === selectedRoleId
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const percentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  const isCompleted = completedSteps === totalSteps
  return (
    <Box sx={pageContainerSx}>
      <Container maxWidth="md" sx={contentContainerSx}>

        <Box sx={headerSx}>
          <Typography sx={titleSx}>Profil</Typography>

          {selectedRole && selectedRoleId && (
            <Stack direction="row" spacing={1} alignItems="center" sx={roleSectionLabelSx}>
              <WorkIcon sx={{ fontSize: '1.25rem', color: '#0D9488' }} />
              <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>
                Twoja nowa rola
              </Typography>
            </Stack>
          )}
        {selectedRole && selectedRoleId && (
          <Box sx={topSectionSx}>
            <Box sx={roleSectionSx}>
              <Box sx={roleCardSx}>
                <Tooltip title="Wybranej roli nie można zmienić" arrow placement="top">
                  <LockIcon sx={roleCardLockSx} />
                </Tooltip>
                <Box sx={roleCardHeaderSx}>
                  <Typography sx={roleNameSx}>{selectedRole.name}</Typography>
                  {selectedRecommendation?.justification && (
                    <Box>
                      <Avatar 
                        src={getAvatarUrl(selectedRole.name)} 
                        alt={selectedRole.name}
                        sx={roleAvatarSx}
                      >
                        <WorkIcon sx={{ fontSize: '2rem' }} />
                      </Avatar>
                      <Typography sx={roleJustificationSx}>
                        {selectedRecommendation.justification}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
            <Box sx={progressSectionSx}>
              <Box sx={progressContainerSx}>
                <Box sx={progressCircleBoxSx}>
                  <CircularProgress
                    variant="determinate"
                    value={percentage}
                    size={64}
                    thickness={4}
                   color={isCompleted ? 'primary' : 'secondary'}
                  />
                  <Typography sx={getProgressPercentageSx(isCompleted)}>{percentage}%</Typography>
                </Box>
                <Box sx={progressInfoSx}>
                  <Typography sx={progressLabelSx}>Postęp w roadmapie</Typography>
                  <Typography sx={progressValueSx}>
                    {completedSteps} z {totalSteps} kroków
                  </Typography>
                  <Button
                    variant="text"
                    size="small"
                    color={isCompleted ? 'primary' : 'secondary'}
                    endIcon={<ArrowForwardIcon />}
                    onClick={handleNavigateToRoadmap}
                    sx={{ padding: 0, minWidth: 'auto', mt: '0.25rem' }}
                  >
                    Przejdź do roadmapy
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
        </Box>

        <Stack sx={sectionsContainerSx}>
          <ProfileSection title="Twoje odpowiedzi">
            <QuestionnaireAnswers responses={questionnaireResponses} />
          </ProfileSection>

          {cvUploadedAt && (
            <ProfileSection title="CV">
              <Box sx={cvInfoSx}>
                <PictureAsPdfIcon sx={cvIconSx} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={cvDateSx}>cv.pdf</Typography>
                  <Typography sx={cvTextSx}>
                    Przesłano {formatDate(cvUploadedAt)}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={isDownloading ? <CircularProgress size={16} /> : <DownloadIcon />}
                  onClick={handleDownloadCV}
                  disabled={isDownloading}
                  sx={cvDownloadButtonSx}
                >
                  Pobierz
                </Button>
              </Box>
            </ProfileSection>
          )}
        </Stack>
      </Container>
    </Box>
  );
};
