"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import { createClient } from "@/lib/supabase/client";
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
		const supabase = createClient();
		const { data, error } = await supabase
			.from("author")
			.select("*")
			.order("created_at", { ascending: false });

		if (error) {
			console.error("取得作者資料錯誤:", error.message);
		} else {
			setAuthorData(data);
		}
	}, []);

	useEffect(() => {
		fetchAuthors();
	}, [fetchAuthors]);

	// 處理要刪除的項目
	const handleDeleteSelected = async (ids: string[]) => {
		// console.log("要刪除的 ID：", ids);
		const supabase = createClient();

		const { error } = await supabase.from("author").delete().in("id", ids);

		if (error) {
			console.error("刪除作者失敗：", error.message);
			// alert("刪除失敗，請稍後再試");
		} else {
			console.log("刪除成功");
			setAuthorData((prev) =>
				prev.filter((author) => !ids.includes(author.id)),
			);
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
