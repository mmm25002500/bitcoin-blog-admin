import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

	const body = await req.json();
	const { uid } = body;

	if (!uid) {
		return NextResponse.json(
			{ success: false, error: "缺少 uid" },
			{ status: 400 },
		);
	}

	const { data, error } = await supabase
		.from("author")
		.select("*")
		.eq("id", uid) // 假設你要用 id 當 UID 篩選
		.single(); // 只取一筆

	if (error) {
		console.error("[ERR] 查詢作者失敗：", error.message);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 },
		);
	}

	return NextResponse.json({ success: true, data }, { status: 200 });
}
