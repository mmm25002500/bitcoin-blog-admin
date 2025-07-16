"use client";
import { useState } from "react";
import Image from "next/image";

// icon
import Cancel from "@/images/cancel.svg";
import SearchIcon from "@/images/Search.svg";

import type { SearchProps } from "@/types/Input/Search";

const Search = (props: SearchProps) => {
	const [inputValue, setInputValue] = useState("");

	// 處理輸入框的變化
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value);
		props.onChange(event.target.value);
	};

	// 處理取消按鈕的點擊事件
	const onCancel = () => {
		setInputValue("");
		props.onCancel();
	};

	return (
		<div className="flex items-center relative w-40">
			<input
				type="text"
				placeholder="搜尋"
				value={inputValue}
				onChange={handleChange}
				className={`appearance-none flex items-center justify-between w-full py-2 px-3 pr-10 text-sm font-normal leading-6 h-full border-[1px] border-[#D3D3D3] rounded-md focus:outline-none focus:border-[#0E0E0E] focus:ring-[1px] focus:ring-[#0E0E0E] ${inputValue ? "text-[#1A1A1A]" : "text-[#999999]"}`}
			/>

			<div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
				{inputValue && (
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
					<Image
						src={SearchIcon}
						alt="search"
						width={20}
						height={20}
						className=""
					/>
				</div>
			</div>
		</div>
	);
};

export default Search;
