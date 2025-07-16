import type { LabelProps } from "@/types/Label/Label";

const Label = (props: LabelProps) => {
	return (
		<label
			htmlFor={props.htmlFor}
			className="text-sm font-medium leading-[22px] text-neutral-800"
		>
			{props.text}
			{props.required && <span className="text-[#EE415D]"> *</span>}
		</label>
	);
};

export default Label;
