import { Paper, Typography, Box, Button, Avatar, Stack } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WorkIcon from '@mui/icons-material/Work';
import { RecommendationBadge } from '../RecommendationBadge';
import { getAvatarUrl } from '../../../utils/avatars';
import {
  cardSx,
  recommendedCardSx,
  titleSx,
  descriptionBoxSx,
  justificationSx,
  actionSx,
  selectButtonSx,
  avatarSx,
} from './RoleCard.sx';
import type { RoleCardProps } from './RoleCard.types';

export const RoleCard = ({
  roleId,
  roleName,
  justification,
  variant,
  onSelect,
  disabled = false,
}: RoleCardProps) => {
  const isRecommended = variant === 'recommended';
  const avatarUrl = getAvatarUrl(roleName);

  return (
    <Paper
      elevation={0}
      sx={isRecommended ? recommendedCardSx : cardSx}
    >
      <Stack direction="column" spacing={1.5} sx={{ flex: 1 }}>
        <RecommendationBadge variant={variant} />
        <Typography sx={titleSx}>{roleName}</Typography>
        <Box sx={descriptionBoxSx}>
          <Avatar 
            src={avatarUrl} 
            alt={roleName}
            sx={avatarSx}
          >
            <WorkIcon sx={{ fontSize: '2rem' }} />
          </Avatar>
          <Typography sx={justificationSx}>{justification}</Typography>
        </Box>
      </Stack>
      <Box sx={actionSx}>
        <Button
          variant={isRecommended ? 'contained' : 'outlined'}
          color="primary"
          size="large"
          onClick={() => onSelect(roleId)}
          disabled={disabled}
          startIcon={<CheckCircleOutlineIcon />}
          sx={selectButtonSx}
        >
          Wybierz tę rolę
        </Button>
      </Box>
    </Paper>
  );
};
