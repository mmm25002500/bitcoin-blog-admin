"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import type { AuthorData } from "@/types/Author/Author";

import AddBtn from "@/components/Button/AddBtn";
import Search from "@/components/Input/Search";
import AuthorTable from "@/components/Table/AuthorTable";

const NewsManage = () => {
	const [searchValue, setSearchValue] = useState<string>("");
	const [authorData, setAuthorData] = useState<AuthorData[]>([]);
	const router = useRouter();

	// fetch authors
	const fetchAuthors = useCallback(async () => {
		try {
			const res = await fetch("/api/author/getAuthor", {
				method: "GET",
				credentials: "include", // 如果你有用 cookie 驗證
			});
			const result = await res.json();

			if (result.success) {
				setAuthorData(result.data); // 注意：這裡的資料包含 postQuantity
				// console.log("成功取得 enriched 作者資料", result.data);
			} else {
				console.error("取得 enriched 作者資料失敗：", result.error);
			}
		} catch (err) {
			console.error("fetch 發生錯誤：", err);
		}
	}, []);

	useEffect(() => {
		fetchAuthors();
	}, [fetchAuthors]);

	// 處理要刪除的項目
	const handleDeleteSelected = async (ids: string[]) => {
		try {
			const res = await fetch("/api/author/delAuthor", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ids }),
				credentials: "include", // 若你使用 cookie 驗證（如 Supabase Auth）
			});

			const result = await res.json();

			if (result.success) {
				// console.log("刪除成功");
				setAuthorData((prev) =>
					prev.filter((author) => !ids.includes(author.id)),
				);
			} else {
				console.error("刪除失敗：", result.error);
				// alert("刪除失敗：" + result.error);
			}
		} catch (error) {
			console.error("刪除發生錯誤：", error);
			alert("刪除時發生錯誤，請稍後再試");
		}
	};

	const handleSearchChange = (value: string) => {
		setSearchValue(value);
	};

	const handleSearchCancel = () => {
		setSearchValue("");
	};

	return (
		<>
			{/* nav */}
			<div className="flex">
				<div className="flex gap-5 grow">
					<Search onChange={handleSearchChange} onCancel={handleSearchCancel} />
				</div>
				<div>
					<AddBtn
						onClick={() => router.push("/Manage/Create/Author")}
						label={"新增 +"}
					/>
				</div>
			</div>

			{/* 作者列表 */}
			<AuthorTable
				perPage={10}
				searchValue={searchValue}
				onDelete={handleDeleteSelected} // ✅ 傳入刪除功能
				AuthorData={authorData}
			/>
		</>
	);
};

export default NewsManage;
