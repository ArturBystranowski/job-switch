import { useState, useCallback, useMemo, useEffect } from 'react';
import { Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuestionnaireConfig } from '../../hooks/useQuestionnaire';
import { useUpdateQuestionnaire, useProfileById } from '../../hooks/useProfile';
import { useAuth } from '../../hooks';
import { QuestionnaireStepper, QuestionCard, OpenQuestionCard } from '../../components/questionnaire';
import { LoadingSpinner, ErrorAlert } from '../../components/common';
import type { QuestionnaireResponsesDTO } from '../../types';
import {
  pageContainerSx,
  contentContainerSx,
  stepperWrapperSx,
  questionWrapperSx,
  errorContainerSx,
} from './QuestionnairePage.sx';

type FieldName = keyof QuestionnaireResponsesDTO;

const OPEN_QUESTION_TEXT = 'Dodaj coś od siebie (opcjonalne)';
const OPEN_ANSWER_MAX_LENGTH = 200;

export const QuestionnairePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id ?? '';
  const [activeStep, setActiveStep] = useState(0);
  const [responses, setResponses] = useState<Partial<QuestionnaireResponsesDTO>>({});

  const { data: config, isPending: isConfigPending, isError, error, refetch } = useQuestionnaireConfig();
  const { data: profile, isPending: isProfilePending } = useProfileById(userId);
  const updateQuestionnaire = useUpdateQuestionnaire();

  // Initialize responses from saved profile data
  useEffect(() => {
    if (profile?.questionnaire_responses && Object.keys(profile.questionnaire_responses).length > 0) {
      setResponses(profile.questionnaire_responses as Partial<QuestionnaireResponsesDTO>);
    }
  }, [profile]);

  const isPending = isConfigPending || isProfilePending;

  // Total steps = multiple choice questions + 1 open question
  const totalSteps = (config?.length ?? 0) + 1;
  const isOpenQuestionStep = config ? activeStep === config.length : false;

  const currentQuestion = useMemo(() => {
    if (!config || isOpenQuestionStep) return null;
    return config[activeStep];
  }, [config, activeStep, isOpenQuestionStep]);

  const handleSelect = useCallback((value: string) => {
    if (!currentQuestion) return;
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.field_name]: value,
    }));
  }, [currentQuestion]);

  const handleOpenAnswerChange = useCallback((value: string) => {
    setResponses((prev) => ({
      ...prev,
      open_answer: value,
    }));
  }, []);

  const handleBack = useCallback(() => {
    setActiveStep((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(async () => {
    if (!config) return;

    // If not at the open question yet, go to next step
    if (activeStep < config.length) {
      setActiveStep((prev) => prev + 1);
    } else {
      // At open question - submit the form
      try {
        await updateQuestionnaire.mutateAsync({
          userId,
          responses: responses as QuestionnaireResponsesDTO,
        });
        navigate('/upload-cv');
      } catch (err) {
        console.error('Failed to save questionnaire:', err);
      }
    }
  }, [config, activeStep, responses, userId, updateQuestionnaire, navigate]);

  if (isPending) {
    return (
      <Box sx={pageContainerSx}>
        <LoadingSpinner message="Ładowanie pytań..." fullScreen />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={pageContainerSx}>
        <Box sx={errorContainerSx}>
          <ErrorAlert
            title="Błąd ładowania"
            message={error?.message ?? 'Nie udało się załadować pytań'}
            onRetry={() => refetch()}
          />
        </Box>
      </Box>
    );
  }

  if (!config || config.length === 0) {
    return (
      <Box sx={pageContainerSx}>
        <Box sx={errorContainerSx}>
          <ErrorAlert
            title="Brak danych"
            message="Nie znaleziono pytań kwestionariusza"
          />
        </Box>
      </Box>
    );
  }

  // Render open question card for the last step
  if (isOpenQuestionStep) {
    return (
      <Box sx={pageContainerSx}>
        <Container maxWidth="md" sx={contentContainerSx}>
          <Box sx={stepperWrapperSx}>
            <QuestionnaireStepper
              activeStep={activeStep}
              totalSteps={totalSteps}
            />
          </Box>
          <Box sx={questionWrapperSx}>
            <OpenQuestionCard
              questionText={OPEN_QUESTION_TEXT}
              value={responses.open_answer ?? ''}
              onChange={handleOpenAnswerChange}
              onBack={handleBack}
              onNext={handleNext}
              maxLength={OPEN_ANSWER_MAX_LENGTH}
              isNextDisabled={updateQuestionnaire.isPending}
            />
          </Box>
        </Container>
      </Box>
    );
  }

  // Render multiple choice question card
  if (!currentQuestion) {
    return (
      <Box sx={pageContainerSx}>
        <Box sx={errorContainerSx}>
          <ErrorAlert
            title="Brak danych"
            message="Nie znaleziono pytania"
          />
        </Box>
      </Box>
    );
  }

  const currentFieldName = currentQuestion.field_name as FieldName;
  const currentValue = responses[currentFieldName] as string | undefined ?? null;

  const options = currentQuestion.options.map((opt) => ({
    value: opt.option_value,
    label: opt.option_label,
  }));

  return (
    <Box sx={pageContainerSx}>
      <Container maxWidth="md" sx={contentContainerSx}>
        <Box sx={stepperWrapperSx}>
          <QuestionnaireStepper
            activeStep={activeStep}
            totalSteps={totalSteps}
          />
        </Box>
        <Box sx={questionWrapperSx}>
          <QuestionCard
            questionText={currentQuestion.question_text}
            options={options}
            selectedValue={currentValue}
            onSelect={handleSelect}
            onBack={handleBack}
            onNext={handleNext}
            isFirstQuestion={activeStep === 0}
            isLastQuestion={false}
            isNextDisabled={updateQuestionnaire.isPending}
          />
        </Box>
      </Container>
    </Box>
  );
};
