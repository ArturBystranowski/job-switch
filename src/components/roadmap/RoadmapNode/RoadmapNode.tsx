import { Box, Paper, Typography, Chip } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import LockIcon from '@mui/icons-material/Lock';
import {
  nodeContainerSx,
  timelineConnectorSx,
  getNodeCircleSx,
  getConnectorLineSx,
  contentContainerSx,
  getNodeCardSx,
  nodeTitleSx,
  nodeDescriptionSx,
  getTaskProgressSx,
} from './RoadmapNode.sx';
import type { RoadmapNodeProps } from './RoadmapNode.types';

interface RoadmapNodeWithLastProps extends RoadmapNodeProps {
  isLast: boolean;
}

export const RoadmapNode = ({
  stepId,
  stepNumber,
  title,
  description,
  status,
  tasks,
  completedTaskIds,
  isSelected,
  onSelect,
  isLast,
}: RoadmapNodeWithLastProps) => {
  const handleNodeClick = () => {
    if (status !== 'locked') {
      onSelect(stepId);
    }
  };

  const completedTasksCount = tasks.filter((t) => completedTaskIds.includes(t.id)).length;
  const totalTasksCount = tasks.length;

  const renderNodeIcon = () => {
    if (status === 'completed') {
      return <CheckIcon sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }} />;
    }
    if (status === 'locked') {
      return <LockIcon sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }} />;
    }
    return (
      <Typography sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600 }}>
        {stepNumber}
      </Typography>
    );
  };

  return (
    <Box sx={nodeContainerSx}>
      <Box sx={timelineConnectorSx}>
        <Box sx={getNodeCircleSx(status)} onClick={handleNodeClick}>
          {renderNodeIcon()}
        </Box>
        <Box sx={getConnectorLineSx(isLast, status)} />
      </Box>
      <Box sx={contentContainerSx}>
        <Paper
          elevation={0}
          sx={getNodeCardSx(isSelected, status)}
          onClick={handleNodeClick}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
              <Typography sx={nodeTitleSx}>{title}</Typography>
             
            {status !== 'locked' && totalTasksCount > 0 && (
              <Chip
                label={`${completedTasksCount} z ${totalTasksCount} ukończonych`}
                size="small"
                sx={getTaskProgressSx(status === 'completed')}
              />
            )}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0, my:'1rem'}}>
             <Typography sx={nodeDescriptionSx}>{description}</Typography>
            </Box>
      
        </Paper>
      </Box>
    </Box>
  );
};
