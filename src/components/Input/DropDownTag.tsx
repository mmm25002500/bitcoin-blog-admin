"use client";

import type { DropDownTagProps } from "@/types/Input/DropDownTag";
import CreatableSelect from "react-select/creatable";
import { useMemo } from "react";
import type { MultiValue } from "react-select";

interface Option {
	label: string;
	value: string;
}

const DropDownTag = ({
	options,
	selectedOptions,
	onChange,
}: DropDownTagProps) => {
	const tagOptions: Option[] = useMemo(() => {
		return options.map((tag) => ({ label: tag, value: tag }));
	}, [options]);

	const selectedTagObjects: Option[] = useMemo(() => {
		return selectedOptions.map((tag) => ({ label: tag, value: tag }));
	}, [selectedOptions]);

	const handleChange = (selected: MultiValue<Option>) => {
		const tags = selected.map((option: Option) => option.value);
		onChange(tags);
	};

	const handleCreate = (inputValue: string) => {
		const newTags = [...selectedOptions, inputValue];
		onChange(newTags);
	};

	return (
		<CreatableSelect
			isMulti
			options={tagOptions}
			value={selectedTagObjects}
			onChange={handleChange}
			onCreateOption={handleCreate}
			placeholder="請選擇標籤"
			formatCreateLabel={(inputValue) => `建立 "${inputValue}"`}
			styles={{
				control: (base) => ({
					...base,
					fontSize: "14px",
					lineHeight: "22px",
					fontWeight: 400,
					color: "#B0B0B0",
					border: "1px solid #E3E3E3",
					paddingTop: "3px",
					paddingBottom: "3px",
					borderRadius: "0.375rem",
				}),
				multiValue: (base) => ({
					...base,
					backgroundColor: "#EEF0F6", // ✅ 標籤背景色
					borderRadius: "0.25rem",
					paddingLeft: "6px",
				}),
				multiValueLabel: (base) => ({
					...base,
					color: "#505050", // ✅ 標籤文字顏色
					fontSize: "14px",
					fontWeight: 400,
				}),
				multiValueRemove: (base) => ({
					...base,
					color: "#999999",
					":hover": {
						backgroundColor: "#d3d3d3",
						color: "#000000",
					},
				}),
				dropdownIndicator: (base) => ({
					...base,
					color: "#828282", // 將箭頭變成黑色
					padding: "0 8px",
					":hover": {
						color: "black",
					},
				}),
			}}
		/>
	);
};

export default DropDownTag;
