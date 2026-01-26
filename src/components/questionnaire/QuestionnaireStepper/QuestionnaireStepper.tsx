import { Box, Stepper, Step, StepLabel, MobileStepper, Typography, useMediaQuery, useTheme } from '@mui/material';
import {
  stepperContainerSx,
  stepperSx,
  mobileStepperSx,
  progressTextSx,
} from './QuestionnaireStepper.sx';
import type { QuestionnaireStepperProps } from './QuestionnaireStepper.types';

export const QuestionnaireStepper = ({
  activeStep,
  totalSteps,
  stepLabels,
}: QuestionnaireStepperProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const defaultLabels = Array.from({ length: totalSteps }, (_, i) => `Pytanie ${i + 1}`);
  const labels = stepLabels ?? defaultLabels;

  if (isMobile) {
    return (
      <Box sx={stepperContainerSx}>
        <Typography sx={progressTextSx}>
          Pytanie {activeStep + 1} z {totalSteps}
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
      <Stepper activeStep={activeStep} alternativeLabel sx={stepperSx}>
        {labels.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};
