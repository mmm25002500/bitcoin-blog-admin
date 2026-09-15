// app/api/pageRoute/saveRoutes/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireUser } from "@/lib/supabase/auth";

// 前台保留的路徑，不能拿來當自訂網址
const RESERVED = ["api", "_next"];

const badRequest = (error: string) =>
	NextResponse.json({ success: false, error }, { status: 400 });

export async function POST(req: NextRequest) {
	try {
		const { supabase, error: authError } = await requireUser();
		if (authError) return authError;

		const body = await req.json();
		const input: { key: string; path: string | null }[] = body?.routes;

		if (!Array.isArray(input)) {
			return badRequest("[ERR] routes 必須是陣列");
		}

		// 只能改既有的頁面，不能新增或刪除
		const { data: existing, error: fetchError } = await supabase
			.from("PageRoute")
			.select("key, label, path");

		if (fetchError || !existing) {
			return NextResponse.json(
				{ success: false, error: fetchError?.message ?? "[ERR] 讀取網址設定失敗" },
				{ status: 500 },
			);
		}

		const labelOf = new Map(existing.map((row) => [row.key, row.label]));
		const allKeys = existing.map((row) => row.key.toLowerCase());
		const seen = new Map<string, string>(); // 小寫 path → 使用中的 key

		const rows: { key: string; path: string | null }[] = [];

		for (const item of input) {
			if (!labelOf.has(item?.key)) {
				return badRequest(`[ERR] 不存在的頁面：${item?.key}`);
			}

			const label = labelOf.get(item.key);
			// 前後的 / 去掉；空白或跟原本一樣就當作沒改
			const raw = (item.path ?? "").trim().replace(/^\/+|\/+$/g, "");
			const path = raw && raw !== item.key ? raw : null;

			if (path) {
				if (/[/?#%.\s]/.test(path)) {
					return badRequest(`[ERR] ${label}：網址只能有一段，不能包含 / ? # % . 或空白`);
				}

				const lower = path.toLowerCase();

				if (RESERVED.includes(lower)) {
					return badRequest(`[ERR] ${label}：「${path}」是保留字，不能使用`);
				}

				// 撞到其他頁面的原始路徑，前台會分不清要去哪一頁
				if (allKeys.includes(lower)) {
					return badRequest(`[ERR] ${label}：「${path}」跟其他頁面的原始網址重複`);
				}

				const usedBy = seen.get(lower);
				if (usedBy) {
					return badRequest(`[ERR] ${label}：「${path}」已經被「${labelOf.get(usedBy)}」使用`);
				}
				seen.set(lower, item.key);
			}

			rows.push({ key: item.key, path });
		}

		const oldPath = new Map(existing.map((row) => [row.key, row.path]));
		const changed = rows.filter((row) => oldPath.get(row.key) !== row.path);

		if (changed.length === 0) {
			return NextResponse.json({ success: true }, { status: 200 });
		}

		// 先清空要改的，再寫入新值：兩個頁面互換網址時才不會撞到 unique
		const { error: clearError } = await supabase
			.from("PageRoute")
			.update({ path: null })
			.in(
				"key",
				changed.map((row) => row.key),
			);

		if (clearError) {
			console.error("[ERR] 更新網址設定失敗：", clearError.message);
			return NextResponse.json(
				{ success: false, error: clearError.message },
				{ status: 500 },
			);
		}

		const now = new Date().toISOString();

		for (const row of changed) {
			const { error: updateError } = await supabase
				.from("PageRoute")
				.update({ path: row.path, updated_at: now })
				.eq("key", row.key);

			if (updateError) {
				console.error("[ERR] 更新網址設定失敗：", updateError.message);
				return NextResponse.json(
					{ success: false, error: updateError.message },
					{ status: 500 },
				);
			}
		}

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : "未知錯誤";
		console.error("[ERR] 發生例外錯誤：", errorMessage);

		return NextResponse.json(
			{ success: false, error: errorMessage },
			{ status: 500 },
		);
	}
}
