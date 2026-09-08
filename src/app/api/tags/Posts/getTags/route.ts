// app/api/tags/Posts/getTags/route.ts
import { beginAuth } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getErrorMessage(err: unknown): string {
	return err instanceof Error ? err.message : String(err);
}

export async function GET(req: NextRequest) {
	// 驗證與下面的查詢並行送出，回傳前才收
	const auth = beginAuth();

	const supabase = await createClient();

	try {
		const { searchParams } = new URL(req.url);
		const deduplicate = searchParams.get("deduplicate") === "false"; // 預設 true

		const { data, error } = await supabase.from("Post").select("tags");

		// 查詢已經送出，這時才收驗證結果
		const denied = await auth;
		if (denied) return denied;

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
