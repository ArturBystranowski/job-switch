import { Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { getTaskChipSx } from './TaskBranch.sx';
import type { TaskBranchProps } from './TaskBranch.types';

export const TaskBranch = ({
  title,
  isCompleted,
  onClick,
}: TaskBranchProps) => {
  const getIcon = () => {
    if (isCompleted) {
      return <CheckCircleIcon fontSize="small" />;
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
      sx={getTaskChipSx(isCompleted)}
    />
  );
};
