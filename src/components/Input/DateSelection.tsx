"use client";

import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { zhTW } from "react-day-picker/locale";
import { DayPicker } from "react-day-picker";
import { CalendarIcon } from "@heroicons/react/24/outline";
import "react-day-picker/dist/style.css";
import Image from "next/image";
import Cancel from "@/images/cancel.svg";
import type { DateSelectionProps } from "@/types/Input/DateSelection";

export default function CustomDatePicker(props: DateSelectionProps) {
	const [selected, setSelected] = useState<Date | undefined>(props.selected);
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	const handleSelect = (date: Date | undefined) => {
		setSelected(date);
		props.onSelect(date);
		if (date) setOpen(false);
	};

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
		setSelected(undefined);
		props.onSelect(undefined);
		setOpen(false);
	};

	return (
		<div className="relative w-72" ref={ref}>
			<button
				type="button"
				onClick={() => setOpen(!open)}
				className="w-full border border-[#D3D3D3] rounded-md px-3 py-2 flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-[#0E0E0E]"
			>
				<span
					className={`text-sm leading-6 font-normal ${selected ? "text-[#1A1A1A]" : "text-[#999999]"}`}
				>
					{selected ? format(selected, "yyyy/MM/dd") : "選擇日期"}
				</span>
				<div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
					{selected && (
						<span className="pointer-events-auto cursor-pointer">
							<button type="button" onClick={handleClear}>
								<Image src={Cancel} alt="取消" width={20} height={20} />
							</button>
						</span>
					)}
					<CalendarIcon className="pointer-events-none w-5 h-5 text-gray-500" />
				</div>
			</button>

			{open && (
				<div className="absolute z-10 mt-2 shadow-lg border bg-white rounded-lg p-4">
					<DayPicker
						mode="single"
						selected={selected}
						onSelect={handleSelect}
						locale={zhTW}
						showOutsideDays
						modifiersClassNames={{
							selected: "bg-black text-white",
							today: "text-red-500",
						}}
						classNames={{
							caption: "flex justify-center py-2 mb-4 relative items-center",
							caption_label:
								"text-[#505050] flex items-center font-medium leading-6",
							table: "w-full border-collapse",
							head_row: "flex font-medium text-gray-900",
							head_cell: "m-0.5 w-9 font-normal text-sm",
							row: "flex w-full mt-2",
							cell: "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative",
							day: "h-9 w-9 p-0 font-normal",
							day_selected: "bg-gray-900 text-white",
							day_today: "rounded-md bg-gray-200 text-gray-900",
						}}
					/>
				</div>
			)}
		</div>
	);
}
