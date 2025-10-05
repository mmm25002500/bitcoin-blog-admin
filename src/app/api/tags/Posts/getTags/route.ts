// app/api/tags/Posts/getTags/route.ts
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
		const deduplicate = searchParams.get("deduplicate") === "false"; // 預設 true

		const { data, error } = await supabase.from("Post").select("tags");

		if (error) {
			return NextResponse.json(
				{ success: false, error: error.message },
				{ status: 500 },
			);
		}

		if (!data) {
			return NextResponse.json({ success: true, tags: [] }, { status: 200 });
		}

		// 收集 tags
		const allTags: string[] = data.flatMap((row) => row.tags || []);

		// 是否去重
		const tags = deduplicate ? Array.from(new Set(allTags)) : allTags;

		return NextResponse.json({ success: true, tags }, { status: 200 });
	} catch (err: unknown) {
		return NextResponse.json(
			{ success: false, error: getErrorMessage(err) },
			{ status: 500 },
		);
	}
}
