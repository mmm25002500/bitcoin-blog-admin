"use client";

import { CalendarIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

import Cancel from "@/images/cancel.svg";

interface DateFieldShellProps {
	/** 已格式化好的顯示文字；沒有值時傳 undefined，會顯示 placeholder */
	displayText?: string;
	placeholder: string;
	onClear: () => void;
	/** 日曆內容。close 用來在選完日期後收起面板 */
	children: (close: () => void) => ReactNode;
}

/**
 * 日期欄位的共用外殼：觸發按鈕、清除鈕、日曆面板的開合與點外部關閉。
 *
 * DateSelection（單日）和 DateChoose（區間）原本各自複製了一份這段，
 * 結果 button 巢狀 button 的 bug 也複製了一份，修了一支漏了另一支。
 * 日曆本身的設定兩者差異大，仍由各自的元件決定。
 */
export default function DateFieldShell({
	displayText,
	placeholder,
	onClear,
	children,
}: DateFieldShellProps) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	// 點外部自動關閉日曆
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleClear = () => {
		onClear();
		setOpen(false);
	};

	return (
		<div className="relative w-72" ref={ref}>
			<button
				type="button"
				onClick={() => setOpen(!open)}
				className="w-full border-[1px] border-[#D3D3D3] rounded-md px-3 py-2 flex items-center justify-between focus:outline-none focus:ring-[1px] focus:ring-[#0E0E0E]"
			>
				<span
					className={`text-sm leading-6 font-normal ${displayText ? "text-[#1A1A1A]" : "text-[#999999]"}`}
				>
					{displayText ?? placeholder}
				</span>
			</button>

			{/* 圖示疊在按鈕上，不能放進 button 內（HTML 不允許 button 巢狀 button） */}
			<div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
				{displayText && (
					<button
						type="button"
						onClick={handleClear}
						className="pointer-events-auto cursor-pointer flex items-center"
					>
						<Image src={Cancel} alt="清除日期" width={20} height={20} />
					</button>
				)}
				<CalendarIcon className="pointer-events-none w-5 h-5 text-gray-500" />
			</div>

			{open && (
				<div className="absolute z-10 mt-2 shadow-lg border bg-white rounded-lg p-4">
					{children(() => setOpen(false))}
				</div>
			)}
		</div>
	);
}
