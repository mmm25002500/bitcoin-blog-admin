import type { DeleteBtnProps } from "@/types/Button/DeleteBtn";

const DeleteBtn = (props: DeleteBtnProps) => {
	return (
		<button
			type="button"
			onClick={props.onClick}
			className={`border-[1px] border-[#D82027] cursor-grab hover:bg-red-50 bg-white py-[9px] px-6 rounded-lg text-base font-medium leading-6 text-[#D82027] ${props.className}`}
		>
			{props.label}
		</button>
	);
};

export default DeleteBtn;
