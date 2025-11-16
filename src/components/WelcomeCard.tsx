import { Card, Stack, Typography, Box } from '@mui/material';
import { Celebration } from '@mui/icons-material';
import { welcomeCardSx, cardContentSx, iconBoxSx } from './WelcomeCard.sx';
import { WelcomeCardProps } from './WelcomeCard.types';

export const WelcomeCard = ({ title, subtitle, description }: WelcomeCardProps) => {
  return (
    <Card sx={welcomeCardSx} elevation={3}>
      <Stack sx={cardContentSx} alignItems="center">
        <Box sx={iconBoxSx}>
          <Celebration fontSize="inherit" color="inherit" />
        </Box>
        
        <Typography variant="h3" component="h2" color="primary" textAlign="center">
          {title}
        </Typography>
        
        {subtitle && (
          <Typography variant="h6" component="p" color="text.secondary" textAlign="center">
            {subtitle}
          </Typography>
        )}
        
        <Typography variant="body1" color="text.primary" textAlign="center">
          {description}
        </Typography>
      </Stack>
    </Card>
  );
};

