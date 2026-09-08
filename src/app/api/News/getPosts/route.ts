// app/api/post/getPosts/route.ts
import { beginAuth } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
	// 驗證與下面的查詢並行送出，回傳前才收
	const auth = beginAuth();

	const supabase = await createClient();

	try {
		const { data, error } = await supabase
			.from("News")
			.select("*")
			.order("created_at", { ascending: false });

		// 查詢已經送出，這時才收驗證結果
		const denied = await auth;
		if (denied) return denied;

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
