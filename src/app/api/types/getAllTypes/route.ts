// app/api/types/getAllTypes/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getErrorMessage(err: unknown): string {
	return err instanceof Error ? err.message : String(err);
}

export async function GET(req: NextRequest) {
	const supabase = await createClient();

	try {
		const { searchParams } = new URL(req.url);

		// 預設 true，要關掉就帶 ?deduplicate=false
		const deduplicate = searchParams.get("deduplicate") !== "false";

		// 可選：author_id 篩選
		const authorId = searchParams.get("author_id");

		// 查詢 Post
		let postQuery = supabase.from("Post").select("type");
		if (authorId) {
			postQuery = postQuery.eq("author_id", authorId);
		}

		// 查詢 News
		let newsQuery = supabase.from("News").select("type");
		if (authorId) {
			newsQuery = newsQuery.eq("author_id", authorId);
		}

		const [postRes, newsRes] = await Promise.all([postQuery, newsQuery]);

		if (postRes.error) {
			return NextResponse.json(
				{ success: false, error: postRes.error.message },
				{ status: 500 },
			);
		}
		if (newsRes.error) {
			return NextResponse.json(
				{ success: false, error: newsRes.error.message },
				{ status: 500 },
			);
		}

		// 收集所有 type
		const allTypes: string[] = [
			...(postRes.data?.flatMap((row) => row.type || []) ?? []),
			...(newsRes.data?.flatMap((row) => row.type || []) ?? []),
		];

		// 去重 or 不去重
		const types = deduplicate ? Array.from(new Set(allTypes)) : allTypes;

		return NextResponse.json({ success: true, types }, { status: 200 });
	} catch (err: unknown) {
		return NextResponse.json(
			{ success: false, error: getErrorMessage(err) },
			{ status: 500 },
		);
	}
}
