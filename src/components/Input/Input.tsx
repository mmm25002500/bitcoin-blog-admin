"use client";

import type { InputProps } from "@/types/Input/Input";
import { useState } from "react";

const Input = (props: InputProps) => {
	const [text, setText] = useState<string>(props.value || "");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setText(e.target.value);
		if (props.onChange) {
			props.onChange(e);
		}
	};

	return (
		<input
			type="text"
			value={text}
			name={props.name}
			id={props.id}
			placeholder={props.placeholder}
			onChange={handleChange}
			className={`text-sm font-normal leading-[22px] border-[1px] border-neutral-200 rounded-sm px-3 py-[9px] focus:outline-none focus:border-[#0E0E0E] focus:ring-[1px] ${text ? "text-[#1A1A1A]" : "text-neutral-400"}`}
		/>
	);
};

export default Input;
