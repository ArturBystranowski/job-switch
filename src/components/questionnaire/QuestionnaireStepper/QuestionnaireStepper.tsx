import { Box, Stepper, Step, StepLabel, MobileStepper, Typography, useMediaQuery, useTheme, StepIconProps } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import {
  stepperContainerSx,
  getStepperSx,
  mobileStepperSx,
  progressTextSx,
  stepIconSx,
  stepIconActiveSx,
  stepIconCompletedSx,
  openQuestionIconSx,
  openQuestionIconActiveSx,
  openQuestionIconCompletedSx,
} from './QuestionnaireStepper.sx';
import type { QuestionnaireStepperProps } from './QuestionnaireStepper.types';

interface CustomStepIconProps extends StepIconProps {
  stepNumber: number;
  isOpenQuestion: boolean;
}

const CustomStepIcon = ({ active, completed, stepNumber, isOpenQuestion }: CustomStepIconProps) => {
  if (isOpenQuestion) {
    const iconSx = completed
      ? openQuestionIconCompletedSx
      : active
        ? openQuestionIconActiveSx
        : openQuestionIconSx;

    return (
      <Box sx={iconSx}>
        {completed ? <CheckIcon sx={{ fontSize: '0.875rem' }} /> : <AddIcon sx={{ fontSize: '1rem' }} />}
      </Box>
    );
  }

  const iconSx = completed
    ? stepIconCompletedSx
    : active
      ? stepIconActiveSx
      : stepIconSx;

  return (
    <Box sx={iconSx}>
      {completed ? <CheckIcon sx={{ fontSize: '0.875rem' }} /> : stepNumber}
    </Box>
  );
};

export const QuestionnaireStepper = ({
  activeStep,
  totalSteps,
}: QuestionnaireStepperProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const questionCount = totalSteps - 1; // Last step is open question
  const isOpenQuestionStep = activeStep === questionCount;

  const getProgressText = () => {
    if (isOpenQuestionStep) {
      return 'Pytanie dodatkowe (opcjonalne)';
    }
    return `Pytanie ${activeStep + 1} z ${questionCount}`;
  };

  if (isMobile) {
    return (
      <Box sx={stepperContainerSx}>
        <Typography sx={progressTextSx}>
          {getProgressText()}
        </Typography>
        <MobileStepper
          variant="dots"
          steps={totalSteps}
          position="static"
          activeStep={activeStep}
          sx={mobileStepperSx}
          backButton={null}
          nextButton={null}
        />
      </Box>
    );
  }

  return (
    <Box sx={stepperContainerSx}>
      <Typography sx={progressTextSx}>
        {getProgressText()}
      </Typography>
      <Stepper activeStep={activeStep} sx={getStepperSx()}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <Step key={index}>
            <StepLabel
              StepIconComponent={(props) => (
                <CustomStepIcon
                  {...props}
                  stepNumber={index + 1}
                  isOpenQuestion={index === questionCount}
                />
              )}
            />
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};
