export interface OptionItem {
  value: string;
  label: string;
}

export interface OptionSelectorProps {
  options: OptionItem[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
}
