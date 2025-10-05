// app/api/types/News/getTypes/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getErrorMessage(err: unknown): string {
	return err instanceof Error ? err.message : String(err);
}

export async function GET(req: NextRequest) {
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
		const { searchParams } = new URL(req.url);

		// 預設 true，要關掉去重就帶 ?deduplicate=false
		const deduplicate = searchParams.get("deduplicate") !== "false";
		// 可選：作者 id 篩選
		const authorId = searchParams.get("author_id");

		// 動態查詢
		let query = supabase.from("News").select("type");

		if (authorId) {
			query = query.eq("author_id", authorId);
		}

		const { data, error } = await query;

		if (error) {
			return NextResponse.json(
				{ success: false, error: error.message },
				{ status: 500 },
			);
		}

		if (!data) {
			return NextResponse.json({ success: true, types: [] }, { status: 200 });
		}

		// 收集所有 type
		const allTypes: string[] = data.flatMap((row) => row.type || []);

		// 去重或原樣
		const types = deduplicate ? Array.from(new Set(allTypes)) : allTypes;

		return NextResponse.json({ success: true, types }, { status: 200 });
	} catch (err: unknown) {
		return NextResponse.json(
			{ success: false, error: getErrorMessage(err) },
			{ status: 500 },
		);
	}
}
