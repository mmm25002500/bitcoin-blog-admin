"use client";

import type { DropDownProps } from "@/types/Input/DropDown";
import { useEffect, useState } from "react";
import Image from "next/image";

// icon
import Cancel from "@/images/cancel.svg";

const DropDown = (props: DropDownProps) => {
	const [selectedValue, setSelectedValue] = useState<string>(
		props.selectedOption || "",
	);

	useEffect(() => {
		setSelectedValue(props.selectedOption || "");
	}, [props.selectedOption]);

	// 處理選擇框的變化
	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedValue = event.target.value;
		setSelectedValue(selectedValue);
		props.onSelect(selectedValue);
	};

	// 處理取消按鈕的點擊事件
	const onCancel = () => {
		setSelectedValue("All");
		props.onCancel();
	};

	return (
		<div className="relative">
			<select
				id="dropdown"
				className={`appearance-none flex items-center justify-between w-full py-2 px-3 pr-10 text-sm font-normal leading-6 h-full border-[1px] border-[#D3D3D3] rounded-md focus:outline-none focus:border-[#0E0E0E] focus:ring-[1px] focus:ring-[#0E0E0E] ${props.className} ${selectedValue === "All" || selectedValue === "" ? "text-[#999999]" : "text-[#1A1A1A]"}`}
				onChange={handleChange}
				value={selectedValue}
			>
				<option value="" disabled>
					{props.label_name || "請選擇"}
				</option>
				{props.options.map((option) => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>

			<div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
				{selectedValue !== "All" && selectedValue !== "" && (
					<button
						type="button"
						onClick={onCancel}
						className="pointer-events-auto cursor-grab"
					>
						<Image
							src={Cancel}
							alt="cancle"
							width={20}
							height={20}
							className=""
						/>
					</button>
				)}

				<div className="pointer-events-none">
					<svg
						role="img"
						aria-label="Dropdown arrow"
						className="h-4 w-4"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						viewBox="0 0 24 24"
					>
						<path
							d="M19 9l-7 7-7-7"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</div>
			</div>
		</div>
	);
};

export default DropDown;
