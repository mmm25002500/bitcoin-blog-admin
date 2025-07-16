export interface DropDownProps {
	options: string[];
	selectedOption: string;
	label_name?: string;
	onSelect: (option: string) => void;
	onCancel: () => void;
	className?: string;
}
