import { Box, Typography, CircularProgress } from '@mui/material';
import {
  headerContainerSx,
  headerContentSx,
  roleNameSx,
  progressWrapperSx,
  progressBoxSx,
  progressLabelContainerSx,
  progressPercentageSx,
  progressTextSx,
} from './RoadmapProgressHeader.sx';
import type { RoadmapProgressHeaderProps } from './RoadmapProgressHeader.types';

export const RoadmapProgressHeader = ({
  completedSteps,
  totalSteps,
  roleName,
}: RoadmapProgressHeaderProps) => {
  const progressPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <Box sx={headerContainerSx}>
      <Box sx={headerContentSx}>
        <Typography sx={roleNameSx}>{roleName}</Typography>
        <Box sx={progressWrapperSx}>
          <Box sx={progressBoxSx}>
            <CircularProgress
              variant="determinate"
              value={progressPercentage}
              size={48}
              thickness={4}
              sx={{ color: 'success.main' }}
            />
            <Box sx={progressLabelContainerSx}>
              <Typography sx={progressPercentageSx}>{progressPercentage}%</Typography>
            </Box>
          </Box>
          <Typography sx={progressTextSx}>
            {completedSteps} z {totalSteps} kroków ukończonych
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
