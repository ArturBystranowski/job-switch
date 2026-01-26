import { Box, Paper, Typography, Stack, Grid } from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RouteIcon from '@mui/icons-material/Route';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  containerSx,
  gridContainerSx,
  stepCardSx,
  iconContainerSx,
  stepNumberSx,
  stepTitleSx,
  stepDescriptionSx,
  arrowContainerSx,
} from './StepsPreview.sx';

const STEPS = [
  {
    icon: QuizIcon,
    number: 'Krok 1',
    title: 'Kwestionariusz',
    description: 'Odpowiedz na 5 pytań o swoich preferencjach zawodowych',
    color: '#0D9488',
    bgColor: '#0D948815',
  },
  {
    icon: AutoAwesomeIcon,
    number: 'Krok 2',
    title: 'Analiza AI',
    description: 'Prześlij CV i pozwól AI dopasować dla Ciebie role',
    color: '#6366F1',
    bgColor: '#6366F115',
  },
  {
    icon: RouteIcon,
    number: 'Krok 3',
    title: 'Roadmapa',
    description: 'Otrzymaj spersonalizowany plan rozwoju kariery',
    color: '#22C55E',
    bgColor: '#22C55E15',
  },
];

export const StepsPreview = () => {
  return (
    <Box sx={containerSx}>
      <Box sx={gridContainerSx}>
        <Grid container spacing={{ xs: 2, md: 3 }} alignItems="stretch">
          {STEPS.map((step, index) => (
            <Grid key={step.number} size={{ xs: 12, md: 4 }}>
              <Stack direction="row" alignItems="center" sx={{ height: '100%' }}>
                <Paper sx={stepCardSx} elevation={0}>
                  <Box sx={{ ...iconContainerSx, backgroundColor: step.bgColor }}>
                    <step.icon sx={{ fontSize: '2rem', color: step.color }} />
                  </Box>
                  <Typography sx={stepNumberSx}>{step.number}</Typography>
                  <Typography sx={stepTitleSx}>{step.title}</Typography>
                  <Typography sx={stepDescriptionSx}>{step.description}</Typography>
                </Paper>
                {index < STEPS.length - 1 && (
                  <Box sx={arrowContainerSx}>
                    <ArrowForwardIcon sx={{ fontSize: '1.5rem', mx: 1 }} />
                  </Box>
                )}
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};
