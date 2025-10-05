import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
	const supabase = await createClient();

	// 驗證使用者身份
	// const {
	// 	data: { user },
	// 	error: authError,
	// } = await supabase.auth.getUser();

	// if (authError || !user) {
	// 	return NextResponse.json(
	// 		{ success: false, error: "未授權訪問" },
	// 		{ status: 401 },
	// 	);
	// }

	// 1. 撈出作者清單
	const { data: authors, error: authorError } = await supabase
		.from("author")
		.select("*")
		.order("created_at", { ascending: false });

	if (authorError) {
		console.error("[ERR] 取得作者失敗", authorError.message);
		return NextResponse.json(
			{ success: false, error: authorError.message },
			{ status: 500 },
		);
	}

	// 2. 呼叫 get_news_count function
	const { data: newsCounts, error: newsError } =
		await supabase.rpc("get_news_counts");
	if (newsError) {
		console.error("[ERR] 取得 news count 失敗", newsError.message);
		return NextResponse.json(
			{ success: false, error: newsError.message },
			{ status: 500 },
		);
	}

	// 3. 呼叫 get_post_counts function
	const { data: postCounts, error: postError } =
		await supabase.rpc("get_post_counts");
	if (postError) {
		console.error("[ERR] 取得 post count 失敗", postError.message);
		return NextResponse.json(
			{ success: false, error: postError.message },
			{ status: 500 },
		);
	}

	// 4. 整合 post + news 數量
	const countsMap = new Map<string, number>();

	for (const item of newsCounts ?? []) {
		countsMap.set(
			item.author_id,
			(countsMap.get(item.author_id) ?? 0) + item.count,
		);
	}
	for (const item of postCounts ?? []) {
		countsMap.set(
			item.author_id,
			(countsMap.get(item.author_id) ?? 0) + item.count,
		);
	}

	// 5. 加入 postQuantity 至每位作者資料中
	const enrichedAuthors = authors.map((author) => ({
		...author,
		postQuantity: countsMap.get(author.id) ?? 0,
	}));

	// console.log("[INFO] 成功取得作者清單與文章數量", enrichedAuthors);

	return NextResponse.json(
		{ success: true, data: enrichedAuthors },
		{ status: 200 },
	);
}
