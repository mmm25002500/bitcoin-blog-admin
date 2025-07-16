import type { AddBtnProps } from "@/types/Button/AddBtn";

const AddBtn = (props: AddBtnProps) => {
	return (
		<button
			type="button"
			onClick={props.onClick}
			className={`cursor-grab hover:bg-black/75 bg-[#0E0E0E] py-[9px] px-6 rounded-lg text-base font-medium leading-6 text-white ${props.className}`}
		>
			{props.label}
		</button>
	);
};

export default AddBtn;
