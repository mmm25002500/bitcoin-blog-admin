"use client";

import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { zhTW } from "react-day-picker/locale";
import "react-day-picker/dist/style.css";
import { useEffect, useState } from "react";

import DateFieldShell from "@/components/Input/DateFieldShell";
import type { DateSelectionProps } from "@/types/Input/DateSelection";

/** 單日選擇。外殼共用 DateFieldShell，見該檔說明。 */
export default function CustomDatePicker(props: DateSelectionProps) {
	const [selected, setSelected] = useState<Date | undefined>(props.selected);

	useEffect(() => {
		setSelected(props.selected);
	}, [props.selected]);

	const handleClear = () => {
		setSelected(undefined);
		props.onSelect(undefined);
	};

	return (
		<DateFieldShell
			placeholder="選擇日期"
			displayText={selected ? format(selected, "yyyy/MM/dd") : undefined}
			onClear={handleClear}
		>
			{(close) => (
				<DayPicker
					mode="single"
					selected={selected}
					onSelect={(date) => {
						setSelected(date);
						props.onSelect(date);
						if (date) close();
					}}
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
			)}
		</DateFieldShell>
	);
}
