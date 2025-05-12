export interface DateSelectionProps {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  onCancel?: () => void;
}
