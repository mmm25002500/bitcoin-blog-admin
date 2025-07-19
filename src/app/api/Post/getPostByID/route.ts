// app/api/post/getPostByID/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	const supabase = await createClient();

	const body = await req.json();
	const { id } = body;

	if (!id) {
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

	if (error) {
		console.error("[ERR] 查詢文章失敗：", error.message);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 },
		);
	}

	return NextResponse.json({ success: true, data }, { status: 200 });
}
