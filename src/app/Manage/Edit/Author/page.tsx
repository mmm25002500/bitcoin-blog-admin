"use client";

import AddBtn from "@/components/Button/AddBtn";
import CancelBtn from "@/components/Button/CancelBtn";
import DeleteBtn from "@/components/Button/DeleteBtn";
import ImagePreview from "@/components/Card/ImagePreview";
import Input from "@/components/Input/Input";
import Label from "@/components/Label/Label";
import UploadFile from "@/components/UploadFile/UploadFile";
import { useEffect, useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import toast from "react-hot-toast";

import DateChoose from "@/components/Input/DateChoose";
import DropDown from "@/components/Input/DropDown";
import Search from "@/components/Input/Search";
import PostTable from "@/components/Table/PostTable";
import type { PostData } from "@/types/Table/PostTable";
import type { DateRange } from "react-day-picker";

// TODO:
// 1. 新增文章列表

const mockData: PostData[] = Array.from({ length: 100 }, (_, i) => ({
	id: `#1231${i}`,
	title: "sdsd",
	author_id: i % 2 === 0 ? `Derek ${i + 1}` : `中本蔥 ${i + 1}`,
	created_at: `2025/05/11 12:2${i}`,
	tags: ["區塊鏈日報", "墨山貓", "良兮"],
	type: i % 2 === 0 ? ["走勢分析"] : ["總體經濟"],
	img: i % 2 === 0 ? "/images/author1.png" : "/images/author2.png",
	description: "sd",
	filename: "dfdf",
}));

const EditAuthor = () => {
	const [imageFile, setImageFile] = useState<File | null>(null);

	// 處理路由變化
	const router = useRouter();

	useEffect(() => {
		console.log("imageFile", imageFile);
	}, [imageFile]);

	// 文章類型選單
	const [selectedOption, setSelectedOption] = useState<string>("");
	// 搜尋框的值
	const [searchValue, setSearchValue] = useState<string>("");
	// 日期選擇的值
	const [date, setDate] = useState<DateRange | undefined>();

	const ArticleType = ["All", "News", "Post"];

	// 處理下拉選單的選擇
	const handleSelect = (option: string) => {
		setSelectedOption(option);
		console.log(`選擇的文章類型: ${option}`);
	};

	// 處理取消按鈕的點擊事件
	const handleDropDownCancel = () => {
		setSelectedOption("All");
	};

	// 處理搜尋框的變化
	const handleSearchChange = (value: string) => {
		setSearchValue(value);
		console.log(`搜尋的值: ${value}`);
	};

	// 處理搜尋框的取消按鈕點擊事件
	const handleSearchCancel = () => {
		setSearchValue("");
		console.log("搜尋框取消");
	};

	useEffect(() => {
		if (selectedOption) {
			console.log(`真正選到的文章類型: ${selectedOption}`);
		}
	}, [selectedOption]);

	useEffect(() => {
		if (searchValue) {
			console.log(`搜尋的值: ${searchValue}`);
		}
	}, [searchValue]);

	useEffect(() => {
		if (date) {
			console.log(`選擇的日期範圍: ${date}`);
		}
	}, [date]);

	// 處理日期選擇的變化
	const handleDateSelect = (range: DateRange | undefined) => {
		setDate(range);
		console.log(`選擇的日期範圍: ${range}`);
	};

	// 處理日期選擇的取消按鈕點擊事件
	const handleDateCancel = () => {
		setDate(undefined);
		console.log("日期選擇取消");
	};

	// 處理要刪除的項目
	const handleDeleteSelected = (id: string[]) => {
		console.log("要刪除的 ID：", id);
	};

	return (
		<>
			<div className="flex flex-col min-h-full gap-5 relative">
				{/* 表單區塊 */}
				<div className="flex-1 flex flex-col gap-5 grow">
					{/* 作者名稱 */}
					<div className="flex flex-col gap-2">
						<Label text="作者名稱" htmlFor="name" required className="mb-2" />
						<Input name="name" id="name" placeholder="請輸入標題" />
					</div>

					{/* 作者簡介 */}
					<div className="flex flex-col gap-2">
						<Label
							text="作者簡介"
							htmlFor="description"
							required
							className="mb-2"
						/>
						<Input
							name="description"
							id="description"
							placeholder="請輸入作者簡介"
						/>
					</div>

					{/* 作者頭貼 */}
					<div className="flex flex-col gap-0 grow w-[502px]">
						<Label text="作者頭貼" htmlFor="image" required />
						<span className="text-xs text-[#7C7C7C] mb-2">
							僅限上傳 .jpg、.png 檔案，比例為 1:1
						</span>

						<UploadFile
							previewUrl={imageFile ? URL.createObjectURL(imageFile) : ""}
							onChange={(file) => setImageFile(file)}
							onDrop={(file) => setImageFile(file)}
						/>

						{/* 上傳張數 */}
						{!imageFile && (
							<span className="text-xs text-[#7C7C7C] mt-2">
								上傳張數 {imageFile ? 1 : 0}/1
							</span>
						)}

						{/* 圖片預覽 */}
						{imageFile && (
							<ImagePreview
								imageFile={imageFile}
								onDelete={() => setImageFile(null)}
							/>
						)}
					</div>

					<div className="px-4 pt-4 border-[1px] border-neutral-200 rounded-xl">
						<Label text="文章列表" htmlFor="name" className="mb-2" />

						{/* nav */}
						<div className="flex mt-3">
							<div className="flex gap-5 grow">
								<DateChoose
									selected={undefined}
									onSelect={handleDateSelect}
									onCancel={handleDateCancel}
								/>
								<DropDown
									options={ArticleType}
									selectedOption={selectedOption}
									onCancel={handleDropDownCancel}
									onSelect={handleSelect}
								/>
								<Search
									onChange={handleSearchChange}
									onCancel={handleSearchCancel}
								/>
							</div>
							<div>
								<AddBtn
									onClick={() => router.push("/Manage/Create/Post")}
									label={"新增 +"}
									className=""
								/>
							</div>
						</div>

						{/* 文章列表 */}
						<PostTable
							perPage={10}
							type={selectedOption}
							searchValue={searchValue}
							date={date}
							onDelete={handleDeleteSelected}
							PostData={mockData}
						/>
					</div>
				</div>
			</div>

			{/* 按鈕區塊 */}
			<div className="pt-20">
				<div className="absolute bottom-0 right-0 bg-white py-4 w-full shadow-[0_-4px_8px_-3px_rgba(0,0,0,0.05)]">
					<div className="flex justify-end gap-2 pr-7">
						<DeleteBtn
							label="刪除"
							onClick={() => {
								router.push("/Manage/Author");
								toast.success("文章已成功刪除");
							}}
						/>
						<CancelBtn
							label="發佈"
							onClick={() => {
								router.push("/Manage/Author");
								toast.error("文章刪除失敗");
							}}
						/>
						<AddBtn
							label="儲存"
							onClick={() => {
								router.push("/Manage/Author");
								toast.success("文章已成功刪除");
							}}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default EditAuthor;
