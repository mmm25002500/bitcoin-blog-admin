// app/api/post/getPostByID/route.ts
import { beginAuth } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	// 驗證與下面的查詢並行送出，回傳前才收
	const auth = beginAuth();

	const supabase = await createClient();

	const body = await req.json();
	const { id } = body;

	if (!id) {
		// 未登入的話回 401，不要先透露參數錯誤
		const notAuthed = await auth;
		if (notAuthed) return notAuthed;

		return NextResponse.json(
			{ success: false, error: "缺少 id" },
			{ status: 400 },
		);
	}

	const { data, error } = await supabase
		.from("Post")
		.select("*")
		.eq("id", id)
		.single();

	// 查詢已經送出，這時才收驗證結果
	const denied = await auth;
	if (denied) return denied;

	if (error) {
		console.error("[ERR] 查詢文章失敗：", error.message);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 },
		);
	}

	return NextResponse.json({ success: true, data }, { status: 200 });
}
