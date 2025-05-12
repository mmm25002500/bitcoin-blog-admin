import { DateRange } from "react-day-picker";

export interface DateChooseProps {
  selected: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
  onCancel: () => void;
}