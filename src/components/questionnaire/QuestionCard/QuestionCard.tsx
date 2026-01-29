import { Paper, Typography, Box, Button, Fade } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import { OptionSelector } from '../OptionSelector';
import {
  cardSx,
  questionTextSx,
  optionsContainerSx,
  navigationContainerSx,
  navButtonSx,
} from './QuestionCard.sx';
import type { QuestionCardProps } from './QuestionCard.types';

export const QuestionCard = ({
  questionText,
  options,
  selectedValue,
  onSelect,
  onBack,
  onNext,
  isFirstQuestion,
  isLastQuestion,
  isNextDisabled = false,
}: QuestionCardProps) => {
  const canProceed = selectedValue !== null && !isNextDisabled;

  return (
    <Fade in timeout={300}>
      <Paper sx={cardSx} elevation={0} data-testid='questionnaire-card'>
        <Typography variant='h5' sx={questionTextSx}>
          {questionText}
        </Typography>
        <Box sx={optionsContainerSx}>
          <OptionSelector
            options={options}
            selectedValue={selectedValue}
            onSelect={onSelect}
          />
        </Box>
        <Box sx={navigationContainerSx}>
          <Button
            variant='outlined'
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            disabled={isFirstQuestion}
            sx={navButtonSx}
            data-testid='questionnaire-back-button'
          >
            Wstecz
          </Button>
          <Button
            variant='contained'
            endIcon={isLastQuestion ? <CheckIcon /> : <ArrowForwardIcon />}
            onClick={onNext}
            disabled={!canProceed}
            sx={navButtonSx}
            data-testid='questionnaire-next-button'
          >
            {isLastQuestion ? 'Zakończ' : 'Dalej'}
          </Button>
        </Box>
      </Paper>
    </Fade>
  );
};
