import { Box, Typography, CircularProgress, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import {
  headerContainerSx,
  headerContentSx,
  leftSectionSx,
  roleSectionWrapperSx,
  roleNameSx,
  rightSectionSx,
  progressWrapperSx,
  progressBoxSx,
  progressLabelContainerSx,
  progressTextSx,
  profileIconSx,
} from './RoadmapProgressHeader.sx';
import type { RoadmapProgressHeaderProps } from './RoadmapProgressHeader.types';
import { getProgressPercentageSx } from '../../../pages/ProfilePage/ProfilePage.sx';

export const RoadmapProgressHeader = ({
  completedSteps,
  totalSteps,
  roleName,
}: RoadmapProgressHeaderProps) => {
  const navigate = useNavigate();
  const progressPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  const isCompleted = completedSteps === totalSteps;
  return (
    <Box sx={headerContainerSx}>
      <Box sx={headerContentSx}>
        <Box sx={leftSectionSx}>
          <Box sx={roleSectionWrapperSx}>
            {/* <Box sx={timelineAlignmentSx} /> */}
            <Typography sx={roleNameSx}>{roleName}</Typography>
          </Box>
        </Box>
        <Box sx={rightSectionSx}>
          <Box sx={progressWrapperSx}>
            <Box sx={progressBoxSx}>
              <CircularProgress
                variant="determinate"
                value={progressPercentage}
                size={48}
                thickness={4}
                color={isCompleted ? 'primary' : 'secondary'}
              />
              <Box sx={progressLabelContainerSx}>
                <Typography sx={getProgressPercentageSx(isCompleted)}>{progressPercentage}%</Typography>
              </Box>
            </Box>
            <Typography sx={progressTextSx}>
              {completedSteps} z {totalSteps} kroków ukończonych
            </Typography>
          </Box>
          <IconButton
            sx={profileIconSx}
            onClick={() => navigate('/profile')}
            aria-label="Przejdź do profilu"
          >
            <PersonIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};
