export interface OpenQuestionCardProps {
  questionText: string;
  value: string;
  onChange: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
  maxLength?: number;
  isNextDisabled?: boolean;
}
