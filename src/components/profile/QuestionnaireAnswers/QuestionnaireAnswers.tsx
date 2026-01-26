import { List, ListItem, Typography, Box } from '@mui/material';
import { listSx, listItemSx, questionSx, answerSx } from './QuestionnaireAnswers.sx';
import type { QuestionnaireAnswersProps } from './QuestionnaireAnswers.types';

const QUESTION_LABELS: Record<string, string> = {
  work_style: 'Jak wolisz pracować?',
  client_interaction: 'Jak często chcesz kontaktować się z klientami?',
  aesthetic_focus: 'Jak ważna jest dla Ciebie estetyka i design?',
  teamwork_preference: 'Jaką rolę preferujesz w zespole?',
  problem_solving_approach: 'Jak podchodzisz do rozwiązywania problemów?',
};

const ANSWER_LABELS: Record<string, Record<string, string>> = {
  work_style: {
    independent: 'Samodzielnie',
    collaborative: 'W zespole',
    mixed: 'Elastycznie',
  },
  client_interaction: {
    minimal: 'Rzadko',
    moderate: 'Czasami',
    extensive: 'Często',
  },
  aesthetic_focus: {
    low: 'Mniej ważna',
    medium: 'Umiarkowanie',
    high: 'Bardzo ważna',
  },
  teamwork_preference: {
    low: 'Praca indywidualna',
    medium: 'Równowaga',
    high: 'Intensywna współpraca',
  },
  problem_solving_approach: {
    analytical: 'Analitycznie',
    creative: 'Kreatywnie',
    practical: 'Praktycznie',
  },
};

export const QuestionnaireAnswers = ({ responses }: QuestionnaireAnswersProps) => {
  if (!responses) {
    return (
      <Typography color="text.secondary">Brak odpowiedzi</Typography>
    );
  }

  const entries = Object.entries(responses);

  return (
    <List sx={listSx}>
      {entries.map(([field, value]) => (
        <ListItem key={field} sx={listItemSx} disablePadding>
          <Box>
            <Typography sx={questionSx}>
              {QUESTION_LABELS[field] ?? field}
            </Typography>
            <Typography sx={answerSx}>
              {ANSWER_LABELS[field]?.[value] ?? value}
            </Typography>
          </Box>
        </ListItem>
      ))}
    </List>
  );
};
