import { Paper, Typography, Box, Button, Stack } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { RecommendationBadge } from '../RecommendationBadge';
import {
  cardSx,
  recommendedCardSx,
  headerSx,
  titleSx,
  justificationSx,
  actionSx,
  selectButtonSx,
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

  return (
    <Paper
      elevation={0}
      sx={isRecommended ? recommendedCardSx : cardSx}
    >
      <Box sx={headerSx}>
        <Stack spacing={0.5}>
          <RecommendationBadge variant={variant} />
          <Typography sx={titleSx}>{roleName}</Typography>
        </Stack>
      </Box>
      <Typography sx={justificationSx}>{justification}</Typography>
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
