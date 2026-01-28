import { AppBar, Toolbar, Typography, Button, Stack } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { UserMenu } from '../UserMenu';
import {
  headerSx,
  toolbarSx,
  logoSx,
  authButtonsContainerSx,
  loginButtonSx,
  registerButtonSx,
} from './AppHeader.sx';
import type { AppHeaderProps } from './AppHeader.types';

export const AppHeader = ({
  isAuthenticated = false,
  userEmail,
  onLogout,
}: AppHeaderProps) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <AppBar sx={headerSx}>
      <Toolbar sx={toolbarSx}>
        <Typography component="span" sx={logoSx} onClick={handleLogoClick}>
          JobSwitch
        </Typography>

        <Stack sx={authButtonsContainerSx} direction="row" gap={1.5}>
          {isAuthenticated ? (
            <UserMenu userEmail={userEmail} onLogout={onLogout} />
          ) : (
            <>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                color="primary"
                sx={loginButtonSx}
              >
                Zaloguj się
              </Button>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                color="primary"
                sx={registerButtonSx}
              >
                Zarejestruj się
              </Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
