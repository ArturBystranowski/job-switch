import { Chip } from '@mui/material';
import { recommendedBadgeSx, alternativeBadgeSx } from './RecommendationBadge.sx';
import type { RecommendationBadgeProps } from './RecommendationBadge.types';

export const RecommendationBadge = ({ variant }: RecommendationBadgeProps) => {
  const isRecommended = variant === 'recommended';

  return (
    <Chip
      label={isRecommended ? 'Rekomendowane' : 'Alternatywna'}
      size="small"
      sx={isRecommended ? recommendedBadgeSx : alternativeBadgeSx}
    />
  );
};
