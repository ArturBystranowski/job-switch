import { Paper, Typography, Box, Button, TextField, Fade } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import {
  cardSx,
  questionTextSx,
  textFieldContainerSx,
  textFieldSx,
  charCountSx,
  charCountWarningSx,
  navigationContainerSx,
  navButtonSx,
} from './OpenQuestionCard.sx';
import type { OpenQuestionCardProps } from './OpenQuestionCard.types';

const DEFAULT_MAX_LENGTH = 200;

export const OpenQuestionCard = ({
  questionText,
  value,
  onChange,
  onBack,
  onNext,
  maxLength = DEFAULT_MAX_LENGTH,
  isNextDisabled = false,
}: OpenQuestionCardProps) => {
  const charCount = value.length;
  const isNearLimit = charCount >= maxLength * 0.9;
  const isAtLimit = charCount >= maxLength;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  return (
    <Fade in timeout={300}>
      <Paper sx={cardSx} elevation={0} data-testid='questionnaire-card'>
        <Typography variant='h5' sx={questionTextSx}>
          {questionText}
        </Typography>
        <Box sx={textFieldContainerSx}>
          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder='Napisz coś o sobie, swoich zainteresowaniach lub oczekiwaniach...'
            value={value}
            onChange={handleChange}
            sx={textFieldSx}
            inputProps={{
              maxLength: maxLength,
              'data-testid': 'questionnaire-open-answer-input',
            }}
          />
        </Box>
        <Typography sx={isNearLimit ? charCountWarningSx : charCountSx}>
          {charCount}/{maxLength} znaków
        </Typography>
        <Box sx={navigationContainerSx}>
          <Button
            variant='outlined'
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={navButtonSx}
            data-testid='questionnaire-back-button'
          >
            Wstecz
          </Button>
          <Button
            variant='contained'
            endIcon={<CheckIcon />}
            onClick={onNext}
            disabled={isNextDisabled || isAtLimit}
            sx={navButtonSx}
            data-testid='questionnaire-next-button'
          >
            Zakończ
          </Button>
        </Box>
      </Paper>
    </Fade>
  );
};
