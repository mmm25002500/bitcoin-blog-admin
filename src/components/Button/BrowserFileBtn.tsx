import type { BrowserFileBtnProps } from "@/types/Button/BrowserFileBtn";

const BrowserFileBtn = (props: BrowserFileBtnProps) => {
	return (
		<button
			type="button"
			onClick={props.onClick}
			className={`border-[1px] border-[#0E0E0E] cursor-grab hover:bg-gray-50 bg-white py-[5px] px-3 rounded-b-sm text-sm font-medium leading-6 text-[#0E0E0E] ${props.className}`}
		>
			{props.label}
		</button>
	);
};

export default BrowserFileBtn;
