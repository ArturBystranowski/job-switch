import { Box, Typography, Button } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { heroContainerSx, titleSx, subtitleSx, ctaButtonSx } from './LandingHero.sx';
import type { LandingHeroProps } from './LandingHero.types';

export const LandingHero = ({ onStart, isAuthenticated = false }: LandingHeroProps) => {
  return (
    <Box sx={heroContainerSx}>
      <Typography variant="h1" component="h1" sx={titleSx}>
        Znajdź swoją ścieżkę w IT
      </Typography>
      <Typography variant="body1" sx={subtitleSx}>
        Odpowiedz na kilka pytań, prześlij CV, a my zaproponujemy Ci idealną rolę z
        planem rozwoju
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={onStart}
        endIcon={<RocketLaunchIcon />}
        sx={ctaButtonSx}
      >
        {isAuthenticated ? 'Rozpocznij' : 'Zaloguj się i rozpocznij'}
      </Button>
    </Box>
  );
};
