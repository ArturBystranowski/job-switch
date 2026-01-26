import type { OptionItem } from '../OptionSelector/OptionSelector.types';

export interface QuestionCardProps {
  questionText: string;
  options: OptionItem[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
  onBack?: () => void;
  onNext: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isNextDisabled?: boolean;
}
