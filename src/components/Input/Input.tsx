"use client";

import type { InputProps } from "@/types/Input/Input";

const Input = (props: InputProps) => {
	// console.log(props.id, "Input value:", props.value);

	return (
		<input
			type="text"
			value={props.value || ""}
			name={props.name}
			id={props.id}
			placeholder={props.placeholder}
			onChange={props.onChange}
			className={`text-sm font-normal leading-[22px] border-[1px] border-neutral-200 rounded-sm px-3 py-[9px] focus:outline-none focus:border-[#0E0E0E] focus:ring-[1px] ${props.value ? "text-[#1A1A1A]" : "text-neutral-400"}`}
		/>
	);
};

export default Input;
