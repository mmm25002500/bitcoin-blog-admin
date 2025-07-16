import type { LoginBtnProps } from "@/types/Button/LoginBtn";

const LoginBtn = (props: LoginBtnProps) => {
	return (
		<button
			type="button"
			className="bg-[#0E0E0E] text-white font-medium text-base leading-6 py-[9px] px-6 rounded-[4px] hover:bg-[#383434] hover:cursor-pointer"
			onClick={props.onClick}
		>
			{props.label}
		</button>
	);
};

export default LoginBtn;
