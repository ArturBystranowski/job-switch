import { List, ListItem, Typography, Box, Chip, Stack } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import {
  listSx,
  listItemSx,
  questionSx,
  answerSx,
  questionNumberSx,
  openAnswerContainerSx,
  openAnswerLabelSx,
  openAnswerTextSx,
  openAnswerChipSx,
} from './QuestionnaireAnswers.sx';
import type { QuestionnaireAnswersProps } from './QuestionnaireAnswers.types';

const QUESTION_ORDER = [
  'work_style',
  'client_interaction',
  'aesthetic_focus',
  'teamwork_preference',
  'problem_solving_approach',
  'leadership_preference',
  'technical_depth',
  'data_vs_design',
  'coding_interest',
  'uncertainty_handling',
] as const;

const QUESTION_LABELS: Record<string, string> = {
  work_style: 'Jak wolisz pracować?',
  client_interaction: 'Ile kontaktu z klientem/użytkownikiem końcowym Ci odpowiada?',
  aesthetic_focus: 'Jak ważna jest dla Ciebie warstwa wizualna produktu?',
  teamwork_preference: 'Jak oceniasz swoją preferencję do pracy zespołowej?',
  problem_solving_approach: 'Jak podchodzisz do rozwiązywania problemów?',
  leadership_preference: 'Jak czujesz się w roli lidera lub koordynatora?',
  technical_depth: 'Jak głęboko chcesz wchodzić w techniczne szczegóły?',
  data_vs_design: 'Co bardziej Cię fascynuje?',
  coding_interest: 'Jak widzisz swoją przyszłość w kodowaniu?',
  uncertainty_handling: 'Jak reagujesz na zmieniające się wymagania i niepewność?',
};

const ANSWER_LABELS: Record<string, Record<string, string>> = {
  work_style: {
    independent: 'Samodzielnie, w swoim tempie',
    collaborative: 'W zespole, z częstą komunikacją',
    mixed: 'Elastycznie - zależnie od zadania',
  },
  client_interaction: {
    minimal: 'Minimum - wolę skupić się na kodzie',
    moderate: 'Umiarkowany - czasem rozmowy są OK',
    extensive: 'Dużo - lubię rozumieć potrzeby użytkowników',
  },
  aesthetic_focus: {
    low: 'Mało - liczy się funkcjonalność',
    medium: 'Średnio - ważne, ale nie priorytet',
    high: 'Bardzo - design i UX są kluczowe',
  },
  teamwork_preference: {
    low: 'Wolę pracować samodzielnie',
    medium: 'Zespół OK, ale potrzebuję czasu na fokus',
    high: 'Uwielbiam współpracę i burze mózgów',
  },
  problem_solving_approach: {
    analytical: 'Analitycznie - rozkładam na części, szukam wzorców',
    creative: 'Kreatywnie - szukam niestandardowych rozwiązań',
    practical: 'Praktycznie - najprostsze rozwiązanie które działa',
  },
  leadership_preference: {
    executor: 'Wolę być wykonawcą - realizuję zadania, nie chcę zarządzać',
    situational: 'Mogę koordynować gdy trzeba, ale nie szukam tego aktywnie',
    natural_leader: 'Naturalnie przejmuję inicjatywę i organizuję pracę innych',
  },
  technical_depth: {
    deep: 'Chcę być ekspertem technicznym, rozumieć każdy szczegół',
    general: 'Wystarczy mi rozumienie technologii na poziomie koncepcyjnym',
    process_focused: 'Wolę skupić się na procesach i ludziach niż na technologii',
  },
  data_vs_design: {
    data: 'Analiza danych, szukanie wzorców, wyciąganie wniosków',
    design: 'Tworzenie interfejsów, estetyka, doświadczenia użytkownika',
    coordination: 'Organizacja pracy, koordynacja zespołu, planowanie',
  },
  coding_interest: {
    daily_coding: 'Chcę programować na co dzień - to moje główne zajęcie',
    scripting: 'Mogę skryptować i automatyzować, ale nie full-time coding',
    no_coding: 'Wolę nie kodować - skupiam się na innych aspektach',
  },
  uncertainty_handling: {
    stability: 'Wolę jasne specyfikacje i stabilność - zmiany mnie stresują',
    adaptable: 'Adaptuję się, ale potrzebuję ogólnego kierunku',
    thrives_in_chaos: 'Świetnie odnajduję się w chaosie i zmianach',
  },
};

export const QuestionnaireAnswers = ({ responses }: QuestionnaireAnswersProps) => {
  if (!responses) {
    return (
      <Typography color="text.secondary">Brak odpowiedzi</Typography>
    );
  }

  const openAnswer = responses.open_answer;

  return (
    <Stack spacing={0}>
      <List sx={listSx}>
        {QUESTION_ORDER.map((field, index) => {
          const value = responses[field];
          if (!value) return null;

          return (
            <ListItem key={field} sx={listItemSx} disablePadding>
              <Box>
                <Typography sx={questionSx}>
                  <Box component="span" sx={questionNumberSx}>{index + 1}.</Box>
                  {QUESTION_LABELS[field] ?? field}
                </Typography>
                <Typography sx={answerSx}>
                  {ANSWER_LABELS[field]?.[value] ?? value}
                </Typography>
              </Box>
            </ListItem>
          );
        })}
      </List>

      {openAnswer && (
        <Box sx={openAnswerContainerSx}>
          <Stack direction="row" spacing={1} alignItems="center" sx={openAnswerLabelSx}>
            <ChatBubbleOutlineIcon sx={{ fontSize: '1rem' }} />
            <Typography component="span">Odpowiedź otwarta</Typography>
            <Chip label="Opcjonalne" size="small" sx={openAnswerChipSx} />
          </Stack>
          <Typography sx={openAnswerTextSx}>
            {openAnswer}
          </Typography>
        </Box>
      )}
    </Stack>
  );
};
