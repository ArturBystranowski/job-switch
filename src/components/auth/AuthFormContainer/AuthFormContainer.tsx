import { Box, Container, Paper, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  containerSx,
  paperSx,
  logoContainerSx,
  logoTextSx,
  titleSx,
  subtitleSx,
  backLinkContainerSx,
  backLinkSx,
} from './AuthFormContainer.sx';
import type { AuthFormContainerProps } from './AuthFormContainer.types';

export const AuthFormContainer = ({
  title,
  subtitle,
  children,
  maxWidth = 'xs',
}: AuthFormContainerProps) => {
  return (
    <Box sx={containerSx}>
      <Container maxWidth={maxWidth}>
        <Paper sx={paperSx} elevation={0}>
          <Box sx={logoContainerSx}>
            <Link component={RouterLink} to="/" sx={logoTextSx}>
              JobSwitch
            </Link>
          </Box>
          <Typography variant="h5" sx={titleSx}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={subtitleSx}>
              {subtitle}
            </Typography>
          )}
          {children}
          <Box sx={backLinkContainerSx}>
            <Link component={RouterLink} to="/" sx={backLinkSx} underline="none">
              <ArrowBackIcon fontSize="small" />
              Wróć na stronę główną
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
