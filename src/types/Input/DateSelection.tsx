import { DateRange } from "react-day-picker";

export interface DateSelectionProps {
  selected: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
  onCancel: () => void;
}