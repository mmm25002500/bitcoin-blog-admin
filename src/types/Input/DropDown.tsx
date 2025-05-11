export interface DropDownProps {
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
  onCancel: () => void;
  className?: string;
}