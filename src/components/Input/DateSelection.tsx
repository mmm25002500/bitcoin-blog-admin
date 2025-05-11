'use client';

import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { zhTW } from "react-day-picker/locale";
import { DayPicker, useDayPicker, type DateRange } from "react-day-picker";
import { CalendarIcon } from "@heroicons/react/24/outline";
import "react-day-picker/dist/style.css";
import Image from "next/image";
import Cancel from "@/images/cancel.svg";

// TODO：
// 1. Props 傳入及傳出 date

// 客製化 Nav，左右選單及 Today
function CustomNavigation() {
  const { goToMonth, previousMonth, nextMonth } = useDayPicker();
  const today = new Date();

  return (
    <div className="flex items-center absolute h-[var(--rdp-nav-height)] top-0 right-0 text-[#505050] font-medium text-base leading-[18px]">
      <button
        onClick={() => previousMonth && goToMonth(previousMonth)}
        disabled={!previousMonth}
        className="p-2 border-[1px] border-[#E9E9E9] rounded-sm"
      >
        &lt;
      </button>
      <button
        onClick={() => goToMonth(today)}
        className="mx-1"
      >
        today
      </button>
      <button
        onClick={() => nextMonth && goToMonth(nextMonth)}
        disabled={!nextMonth}
        className="p-2 border-[1px] border-[#E9E9E9] rounded-sm"
      >
        &gt;
      </button>
    </div>
  );
}

export default function CustomDatePicker() {
  const [selected, setSelected] = useState<DateRange | undefined>();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [month, setMonth] = useState(new Date());

  // 選擇日期後，關閉日曆
  const handleSelect = (range: DateRange | undefined) => {
    setSelected(range);
    if (range?.from && range?.to) {
      setOpen(false);
    }
  };

  // 點外部自動關閉日曆
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-72" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full border rounded-md px-3 py-2 flex items-center justify-between focus:outline-none focus:ring-[1px] focus:ring-[#0E0E0E]"
      >
        <span className={`text-sm leading-6 font-normal ${selected?.from ? "text-[#1A1A1A]" : "text-[#999999]"}`}>
          {selected?.from
            ? selected.to
              ? `${format(selected.from, "yyyy/MM/dd")} - ${format(selected.to, "yyyy/MM/dd")}`
              : `${format(selected.from, "yyyy/MM/dd")}（起）`
            : "發佈日期"}
        </span>

        <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          <button className="pointer-events-auto cursor-grab">
            <Image
              src={Cancel}
              alt="cancle"
              width={20}
              height={20}
              className=""
            />
          </button>
          <CalendarIcon className="pointer-events-none w-5 h-5 text-gray-500" />
        </div>
      </button>

      {
        open && (
          <div className="absolute z-10 mt-2 shadow-lg border bg-white rounded-lg p-4">
            <DayPicker
              mode="range"
              required
              selected={selected}
              onSelect={handleSelect} month={month}
              onMonthChange={setMonth}
              // month={selected?.from ?? new Date()}
              captionLayout="dropdown"
              showOutsideDays
              locale={zhTW}
              classNames={{
                caption: "flex justify-center py-2 mb-4 relative items-center",
                caption_label: "text-[#505050] flex items-center font-medium leading-6",
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
                Nav: CustomNavigation
              }}

              footer={
                <div className="flex justify-between items-center mt-4">
                  <button
                    className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={() => setSelected(undefined)}
                  >
                    清除
                  </button>
                </div>
              }
            />
          </div>
        )
      }
    </div >
  );
}
