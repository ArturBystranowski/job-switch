import { Box, Paper, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import LockIcon from '@mui/icons-material/Lock';
import { VariantBranch } from '../VariantBranch';
import {
  nodeContainerSx,
  timelineConnectorSx,
  getNodeCircleSx,
  getConnectorLineSx,
  contentContainerSx,
  getNodeCardSx,
  nodeTitleSx,
  nodeDescriptionSx,
  variantsContainerSx,
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
  variants,
  completedVariantIds,
  isSelected,
  onSelect,
  onVariantSelect,
  isLast,
}: RoadmapNodeWithLastProps) => {
  const handleNodeClick = () => {
    if (status !== 'locked') {
      onSelect(stepId);
    }
  };

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
          <Typography sx={nodeTitleSx}>{title}</Typography>
          <Typography sx={nodeDescriptionSx}>{description}</Typography>
          {status !== 'locked' && variants.length > 0 && (
            <Box sx={variantsContainerSx}>
              {variants.map((variant) => (
                <VariantBranch
                  key={variant.id}
                  variantId={variant.id}
                  title={variant.title}
                  isCompleted={completedVariantIds.includes(variant.id)}
                  isRecommended={variant.order_number === 1}
                  onClick={() => onVariantSelect(variant.id)}
                />
              ))}
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};
