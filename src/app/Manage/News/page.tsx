"use client";

import AddBtn from "@/components/Button/AddBtn";
import DateChoose from "@/components/Input/DateChoose";
import DropDown from "@/components/Input/DropDown";
import Search from "@/components/Input/Search";
import NewsTable from "@/components/Table/NewsTable";
import { createClient } from "@/lib/supabase/client";

import type { PostData } from "@/types/Table/PostTable";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";

const NewsManage = () => {
	// 文章類型選單
	const [selectedOption, setSelectedOption] = useState<string>("");
	// 搜尋框的值
	const [searchValue, setSearchValue] = useState<string>("");
	// 日期選擇的值
	const [date, setDate] = useState<DateRange | undefined>();
	// 文章資料
	const [postData, setPostData] = useState<PostData[]>([]);

	// 開始時從 Supabase 獲取文章資料
	useEffect(() => {
		const fetchPosts = async () => {
			const supabase = createClient();
			const { data, error } = await supabase
				.from("News")
				.select("*")
				.order("created_at", { ascending: false });

			if (error) {
				console.error("取得文章失敗", error.message);
			} else {
				console.log("取得文章成功", data);
				setPostData(data);
			}
		};

		fetchPosts();
	}, []);

	// 處理路由變化
	const router = useRouter();

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
	const handleDeleteSelected = async (ids: string[]) => {
		console.log("要刪除的 ID：", ids);

		const res = await fetch("/api/News/delPost", {
			method: "POST",
			body: JSON.stringify({ ids }),
			headers: {
				"Content-Type": "application/json",
			},
		});

		const result = await res.json();
		if (result.success) {
			setPostData((prev) => prev.filter((post) => !ids.includes(post.id)));
			alert("刪除成功！");
		} else {
			console.log("刪除失敗：", result.error);
		}
	};

	return (
		<>
			{/* nav */}
			<div className="flex">
				<div className="flex gap-5 grow">
					<DateChoose
						selected={undefined}
						onSelect={handleDateSelect}
						onCancel={handleDateCancel}
					/>
					<DropDown
						options={ArticleType}
						selectedOption={"ss"}
						label_name={"文章類型"}
						onCancel={handleDropDownCancel}
						onSelect={handleSelect}
					/>
					<Search onChange={handleSearchChange} onCancel={handleSearchCancel} />
				</div>
				<div>
					<AddBtn
						onClick={() => router.push("/Manage/Create/News")}
						label={"新增 +"}
						className=""
					/>
				</div>
			</div>

			{/* 文章列表 */}
			<NewsTable
				perPage={10}
				type={selectedOption}
				searchValue={searchValue}
				date={date}
				onDelete={handleDeleteSelected}
				PostData={postData}
			/>
		</>
	);
};

export default NewsManage;
