"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import { createClient } from "@/lib/supabase/client";
import type { AuthorData } from "@/types/Table/AuthorTable";

import AddBtn from "@/components/Button/AddBtn";
import Search from "@/components/Input/Search";
import AuthorTable from "@/components/Table/AuthorTable";

const NewsManage = () => {
	const [searchValue, setSearchValue] = useState<string>("");
	const [authorData, setAuthorData] = useState<AuthorData[]>([]);
	const router = useRouter();

	// ✅ 抓取資料
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
	}, []); // ← 如果 fetchAuthors 不依賴其他變數，可保持空陣列

	useEffect(() => {
		fetchAuthors();
	}, [fetchAuthors]); // ✅ 加入依賴

	// ✅ 刪除作者功能
	const handleDeleteAuthors = async (ids: string[]) => {
		const supabase = createClient();

		const { error } = await supabase.from("author").delete().in("id", ids);

		if (error) {
			console.error("刪除作者失敗：", error.message);
			alert("刪除失敗，請稍後再試");
		} else {
			// 從 state 中移除
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
				onDelete={handleDeleteAuthors} // ✅ 傳入刪除功能
				AuthorData={authorData}
			/>
		</>
	);
};

export default NewsManage;
