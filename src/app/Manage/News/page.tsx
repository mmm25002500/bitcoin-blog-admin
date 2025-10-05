"use client";

import AddBtn from "@/components/Button/AddBtn";
import DateChoose from "@/components/Input/DateChoose";
import DropDown from "@/components/Input/DropDown";
import Search from "@/components/Input/Search";
import NewsTable from "@/components/Table/NewsTable";

import type { PostData } from "@/types/Table/PostTable";
import { useRouter } from "nextjs-toploader/app";
import { useCallback, useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";

const NewsManage = () => {
	// 文章類型選單選項
	const [typeOptions, setTypeOptions] = useState<string[]>([]);
	// 文章類型選單
	const [selectedOption, setSelectedOption] = useState<string>("All");
	// 搜尋框的值
	const [searchValue, setSearchValue] = useState<string>("");
	// 日期選擇的值
	const [date, setDate] = useState<DateRange | undefined>();
	// 文章資料
	const [postData, setPostData] = useState<PostData[]>([]);

	// fetch posts
	const fetchPosts = useCallback(async () => {
		try {
			const res = await fetch("/api/News/getPosts", {
				method: "GET",
				credentials: "include",
			});
			const result = await res.json();

			if (result.success) {
				setPostData(result.data);
				// console.log("成功取得文章資料", result.data);
			} else {
				console.error("取得文章資料失敗：", result.error);
			}
		} catch (err) {
			console.error("fetch 發生錯誤：", err);
		}
	}, []);

	useEffect(() => {
		fetchPosts();
	}, [fetchPosts]);

	// 處理路由變化
	const router = useRouter();

	// 處理下拉選單的選擇
	const handleSelect = (option: string) => {
		setSelectedOption(option);
		// console.log(`選擇的文章類型: ${option}`);
	};

	// 處理取消按鈕的點擊事件
	const handleDropDownCancel = () => {
		setSelectedOption("All");
	};

	// 處理搜尋框的變化
	const handleSearchChange = (value: string) => {
		setSearchValue(value);
		// console.log(`搜尋的值: ${value}`);
	};

	// 處理搜尋框的取消按鈕點擊事件
	const handleSearchCancel = () => {
		setSearchValue("");
		// console.log("搜尋框取消");
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
		// console.log(`選擇的日期範圍: ${range}`);
	};

	// 處理日期選擇的取消按鈕點擊事件
	const handleDateCancel = () => {
		setDate(undefined);
		// console.log("日期選擇取消");
	};

	// 處理要刪除的項目
	const handleDeleteSelected = async (ids: string[]) => {
		// console.log("要刪除的 ID：", ids);

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

	// 一開始載入時取得文章類型選單的選項
	useEffect(() => {
		const fetchTypes = async () => {
			try {
				const res = await fetch("/api/types/News/getTypes");
				const result = await res.json();

				if (result.success) {
					setTypeOptions(["All", ...result.types]); // 預設 All
				} else {
					console.error("取得 types 失敗：", result.error);
				}
			} catch (err) {
				console.error("types API 錯誤：", err);
			}
		};

		fetchTypes();
	}, []);

	// 篩選文章資料
	const filteredData = postData.filter((post) => {
		// 搜尋關鍵字
		const keyword = searchValue.toLowerCase();
		const matchesSearch =
			post.title.toLowerCase().includes(keyword) ||
			post.description?.toLowerCase().includes(keyword);

		// 篩選文章類型
		const matchesType =
			selectedOption === "All" ? true : post.type?.includes(selectedOption);

		// 篩選日期
		let matchesDate = true;
		if (date?.from || date?.to) {
			const postDate = new Date(post.created_at);
			const from = date.from;
			const to = date.to
				? new Date(
					date.to.getFullYear(),
					date.to.getMonth(),
					date.to.getDate(),
					23,
					59,
					59,
					999
				)
				: undefined;

			matchesDate =
				(!from || postDate >= from) && (!to || postDate <= to);
		}

		return matchesSearch && matchesType && matchesDate;
	});

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
						options={typeOptions}
						selectedOption={selectedOption}
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
				PostData={filteredData}
			/>
		</>
	);
};

export default NewsManage;
