// app/api/post/getPosts/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const supabase = await createClient();

	try {
		const body = await req.json();
		const { type, searchValue, date } = body;

		let query = supabase
			.from("News")
			.select("*")
			.order("created_at", { ascending: false });

		if (type && type !== "All") {
			query = query.contains("type", [type]);
		}

		if (searchValue) {
			query = query.ilike("title", `%${searchValue}%`);
		}

		if (date?.from && date?.to) {
			query = query.gte("created_at", date.from).lte("created_at", date.to);
		}

		const { data, error } = await query;

		if (error) {
			console.error("[ERR] 查詢文章列表失敗：", error.message);
			return NextResponse.json(
				{ success: false, error: error.message },
				{ status: 500 },
			);
		}

		return NextResponse.json({ success: true, data }, { status: 200 });
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : "未知錯誤";

		return NextResponse.json(
			{ success: false, error: errorMessage },
			{ status: 500 },
		);
	}
}
