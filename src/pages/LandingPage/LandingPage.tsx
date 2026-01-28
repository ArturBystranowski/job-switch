import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LandingHero, StepsPreview } from '../../components/landing';
import { AppHeader } from '../../components/layout';
import { useAuth } from '../../hooks';
import { pageContainerSx, mainContentSx } from './LandingPage.sx';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, signOut } = useAuth();

  const handleStart = () => {
    if (isAuthenticated) {
      navigate('/questionnaire');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <Box sx={pageContainerSx}>
      <AppHeader
        isAuthenticated={isAuthenticated}
        userEmail={user?.email}
        onLogout={handleLogout}
      />
      <Box sx={mainContentSx}>
        <LandingHero onStart={handleStart} isAuthenticated={isAuthenticated} />
        <StepsPreview />
      </Box>
    </Box>
  );
};
