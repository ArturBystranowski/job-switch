import { Paper, Typography } from '@mui/material';
import { sectionSx, sectionTitleSx } from './ProfileSection.sx';
import type { ProfileSectionProps } from './ProfileSection.types';

export const ProfileSection = ({ title, children }: ProfileSectionProps) => {
  return (
    <Paper sx={sectionSx} elevation={0}>
      <Typography sx={sectionTitleSx}>{title}</Typography>
      {children}
    </Paper>
  );
};
