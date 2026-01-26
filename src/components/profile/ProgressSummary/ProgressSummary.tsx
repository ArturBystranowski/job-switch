import { Box, Typography, CircularProgress, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  containerSx,
  progressBoxSx,
  progressTextSx,
  infoSx,
  labelSx,
  valueSx,
  linkButtonSx,
} from './ProgressSummary.sx';
import type { ProgressSummaryProps } from './ProgressSummary.types';

export const ProgressSummary = ({
  completedSteps,
  totalSteps,
  onNavigateToRoadmap,
}: ProgressSummaryProps) => {
  const percentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <Box sx={containerSx}>
      <Box sx={progressBoxSx}>
        <CircularProgress
          variant="determinate"
          value={percentage}
          size={80}
          thickness={4}
          color="primary"
        />
        <Typography sx={progressTextSx}>{percentage}%</Typography>
      </Box>
      <Box sx={infoSx}>
        <Typography sx={labelSx}>Postęp w roadmapie</Typography>
        <Typography sx={valueSx}>
          {completedSteps} z {totalSteps} kroków ukończonych
        </Typography>
        <Button
          variant="text"
          color="primary"
          size="small"
          endIcon={<ArrowForwardIcon />}
          onClick={onNavigateToRoadmap}
          sx={linkButtonSx}
        >
          Przejdź do roadmapy
        </Button>
      </Box>
    </Box>
  );
};
