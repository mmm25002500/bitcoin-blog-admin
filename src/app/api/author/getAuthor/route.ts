import { beginAuth } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
	// 驗證與下面的查詢並行送出，回傳前才收
	const auth = beginAuth();

	const supabase = await createClient();


	// 三個查詢互相獨立，一起送出（原本是序列，白等兩趟）
	const [
		{ data: authors, error: authorError },
		{ data: newsCounts, error: newsError },
		{ data: postCounts, error: postError },
	] = await Promise.all([
		supabase.from("author").select("*").order("created_at", { ascending: false }),
		supabase.rpc("get_news_counts"),
		supabase.rpc("get_post_counts"),
	]);

	// 查詢已經送出，這時才收驗證結果
	const denied = await auth;
	if (denied) return denied;

	const failed = authorError ?? newsError ?? postError;
	if (failed) {
		console.error("[ERR] 取得作者清單失敗", failed.message);
		return NextResponse.json(
			{ success: false, error: failed.message },
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
	const enrichedAuthors = (authors ?? []).map((author) => ({
		...author,
		postQuantity: countsMap.get(author.id) ?? 0,
	}));

	// console.log("[INFO] 成功取得作者清單與文章數量", enrichedAuthors);

	return NextResponse.json(
		{ success: true, data: enrichedAuthors },
		{ status: 200 },
	);
}
