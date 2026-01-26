import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LandingHero, StepsPreview } from '../../components/landing';
import { pageContainerSx, mainContentSx } from './LandingPage.sx';

export const LandingPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/questionnaire');
  };

  return (
    <Box sx={pageContainerSx}>
      <Box sx={mainContentSx}>
        <LandingHero onStart={handleStart} />
        <StepsPreview />
      </Box>
    </Box>
  );
};
