import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// 注意：App Router 的 route handler 應該是 export `GET()` function
export async function GET() {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("author")
		.select("*")
		.order("created_at", { ascending: false }); // 可依照需要排序

	if (error) {
		console.error("[ERR] 取得作者失敗", error.message);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 },
		);
	}

	return NextResponse.json({ success: true, data }, { status: 200 });
}
