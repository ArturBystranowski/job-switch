import { Box, Typography } from '@mui/material';
import { cardSx, roleNameSx, justificationSx } from './SelectedRoleCard.sx';
import type { SelectedRoleCardProps } from './SelectedRoleCard.types';

export const SelectedRoleCard = ({ roleName, justification }: SelectedRoleCardProps) => {
  return (
    <Box sx={cardSx}>
      <Typography sx={roleNameSx}>{roleName}</Typography>
      {justification && (
        <Typography sx={justificationSx}>{justification}</Typography>
      )}
    </Box>
  );
};
