// app/api/post/getPostsByUID/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getErrorMessage(err: unknown): string {
	return err instanceof Error ? err.message : String(err);
}

export async function POST(req: NextRequest) {
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

	try {
		const body = await req.json();
		const { uid } = body;

		if (!uid) {
			return NextResponse.json(
				{ success: false, error: "缺少 uid" },
				{ status: 400 },
			);
		}

		const { data, error } = await supabase
			.from("News")
			.select("*")
			.eq("author_id", uid);

		if (error) {
			console.error("[ERR] 查詢文章失敗：", error.message);
			return NextResponse.json(
				{ success: false, error: error.message },
				{ status: 500 },
			);
		}

		return NextResponse.json({ success: true, data }, { status: 200 });
	} catch (err: unknown) {
		return NextResponse.json(
			{ success: false, error: getErrorMessage(err) },
			{ status: 500 },
		);
	}
}
