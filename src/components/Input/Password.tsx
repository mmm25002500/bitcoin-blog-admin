"use client";

import { useState } from "react";
import type { PasswordInputProps } from "@/types/Input/PasswordInput";
import eye_open from "@/images/eye_open.svg";
import eye_closed from "@/images/eye_close.svg";
import Image from "next/image";

const PasswordInput = (props: PasswordInputProps) => {
	const [visible, setVisible] = useState(false);

	return (
		<div className="relative">
			<input
				type={visible ? "text" : "password"}
				placeholder={props.placeholder}
				className={`w-full border-[1px] rounded-[6px] p-2 pr-10 border-[#D3D3D3] bg-white ${props.className}`}
				onChange={props.onChange}
			/>
			<button
				type="button"
				onClick={() => setVisible(!visible)}
				className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
			>
				<Image
					src={visible ? eye_closed : eye_open}
					alt="toggle visibility"
					width={20}
					height={20}
				/>
			</button>
		</div>
	);
};

export default PasswordInput;
