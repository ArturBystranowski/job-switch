import { Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { getVariantChipSx } from './VariantBranch.sx';
import type { VariantBranchProps } from './VariantBranch.types';

export const VariantBranch = ({
  title,
  isCompleted,
  isRecommended,
  onClick,
}: VariantBranchProps) => {
  const getIcon = () => {
    if (isCompleted) {
      return <CheckCircleIcon fontSize="small" />;
    }
    if (isRecommended) {
      return <StarIcon fontSize="small" />;
    }
    return <RadioButtonUncheckedIcon fontSize="small" />;
  };

  return (
    <Chip
      label={title}
      icon={getIcon()}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      size="small"
      sx={getVariantChipSx(isCompleted, isRecommended)}
    />
  );
};
