import { Paper, Typography, Stack } from '@mui/material';
import {
  containerSx,
  optionCardSx,
  optionCardSelectedSx,
  optionLabelSx,
  optionLabelSelectedSx,
} from './OptionSelector.sx';
import type { OptionSelectorProps } from './OptionSelector.types';

export const OptionSelector = ({
  options,
  selectedValue,
  onSelect,
}: OptionSelectorProps) => {
  return (
    <Stack sx={containerSx} spacing={1.5}>
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <Paper
            key={option.value}
            elevation={0}
            onClick={() => onSelect(option.value)}
            sx={isSelected ? optionCardSelectedSx : optionCardSx}
            data-testid={`questionnaire-option-${option.value}`}
          >
            <Typography sx={isSelected ? optionLabelSelectedSx : optionLabelSx}>
              {option.label}
            </Typography>
          </Paper>
        );
      })}
    </Stack>
  );
};
