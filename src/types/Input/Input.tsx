export interface InputProps {
  name: string;
  id: string;
  placeholder: string;
  value?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}