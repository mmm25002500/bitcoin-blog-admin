"use client";

import { format } from "date-fns";
import { DayPicker, useDayPicker, type DateRange } from "react-day-picker";
import { zhTW } from "react-day-picker/locale";
import "react-day-picker/dist/style.css";
import { useState } from "react";

import DateFieldShell from "@/components/Input/DateFieldShell";
import type { DateChooseProps } from "@/types/Input/DateChoose";

// 客製化 Nav，左右選單及 Today
function CustomNavigation() {
	const { goToMonth, previousMonth, nextMonth } = useDayPicker();
	const today = new Date();

	return (
		<div className="flex items-center absolute h-[var(--rdp-nav-height)] top-0 right-0 text-[#505050] font-medium text-base leading-[18px]">
			<button
				type="button"
				onClick={() => previousMonth && goToMonth(previousMonth)}
				disabled={!previousMonth}
				className="p-2 border-[1px] border-[#E9E9E9] rounded-sm"
			>
				&lt;
			</button>
			<button type="button" onClick={() => goToMonth(today)} className="mx-1">
				today
			</button>
			<button
				type="button"
				onClick={() => nextMonth && goToMonth(nextMonth)}
				disabled={!nextMonth}
				className="p-2 border-[1px] border-[#E9E9E9] rounded-sm"
			>
				&gt;
			</button>
		</div>
	);
}

const formatRange = (range: DateRange | undefined) => {
	if (!range?.from) return undefined;
	return range.to
		? `${format(range.from, "yyyy/MM/dd")} - ${format(range.to, "yyyy/MM/dd")}`
		: `${format(range.from, "yyyy/MM/dd")}（起）`;
};

/** 日期區間選擇。外殼共用 DateFieldShell，見該檔說明。 */
export default function CustomDatePicker(props: DateChooseProps) {
	const [selected, setSelected] = useState<DateRange | undefined>();
	const [month, setMonth] = useState(new Date());

	const handleClear = () => {
		setSelected(undefined);
		props.onSelect(undefined);
	};

	return (
		<DateFieldShell
			placeholder="發佈日期"
			displayText={formatRange(selected)}
			onClear={handleClear}
		>
			{(close) => (
				<DayPicker
					mode="range"
					required
					selected={selected}
					onSelect={(range) => {
						setSelected(range);
						// 只選了起日還不算完整區間，先不套用篩選
						props.onSelect(range?.from && range.to ? range : undefined);
						if (range?.from && range.to) close();
					}}
					month={month}
					onMonthChange={setMonth}
					captionLayout="dropdown"
					showOutsideDays
					locale={zhTW}
					classNames={{
						caption: "flex justify-center py-2 mb-4 relative items-center",
						caption_label:
							"text-[#505050] flex items-center font-medium leading-6",
						nav_button:
							"h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300",
						nav_button_previous: "absolute left-1.5",
						nav_button_next: "absolute right-1.5",
						table: "w-full border-collapse",
						head_row: "flex font-medium text-gray-900",
						head_cell: "m-0.5 w-9 font-normal text-sm",
						row: "flex w-full mt-2",
						cell: "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
						day: "h-9 w-9 p-0 font-normal",
						day_range_end: "day-range-end",
						day_selected:
							"rounded-md bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white",
						day_today: "rounded-md bg-gray-200 text-gray-900",
						day_outside:
							"day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
						day_disabled: "text-gray-500 opacity-50",
						day_hidden: "invisible",
					}}
					components={{
						Nav: CustomNavigation,
					}}
					footer={
						<div className="flex justify-between items-center mt-4">
							<button
								type="button"
								className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
								onClick={handleClear}
							>
								清除
							</button>
						</div>
					}
				/>
			)}
		</DateFieldShell>
	);
}
