export interface DropDownTagProps {
  options: string[];
  selectedOptions: string[];
  onChange: (selectedOptions: string[]) => void;
}
