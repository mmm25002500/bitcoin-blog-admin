// app/api/moreInfo/saveCategories/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { MoreInfoCategory } from "@/types/MoreInfo/MoreInfo";

export async function POST(req: NextRequest) {
	try {
		const supabase = await createClient();

		// 驗證使用者身份
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return NextResponse.json(
				{ success: false, error: "未授權訪問" },
				{ status: 401 },
			);
		}

		const body = await req.json();
		const categories: MoreInfoCategory[] = body?.categories;

		if (!Array.isArray(categories)) {
			return NextResponse.json(
				{ success: false, error: "[ERR] categories 必須是陣列" },
				{ status: 400 },
			);
		}

		for (let i = 0; i < categories.length; i++) {
			if (!categories[i]?.title) {
				return NextResponse.json(
					{ success: false, error: `[ERR] 第 ${i + 1} 個分類缺少標題` },
					{ status: 400 },
				);
			}
		}

		// 依畫面上的順序重新編號
		const rows = categories.map((category, index) => ({
			...(category.id ? { id: category.id } : {}),
			label: category.label?.trim() ? category.label.trim() : null,
			title: category.title,
			folder: category.folder || "KnowBTC",
			sort_order: index,
			posts: (category.posts || [])
				.filter((post) => post?.filename)
				.map((post) => ({
					title: post.title,
					filename: post.filename,
				})),
		}));

		// 先寫入（有 id 的更新、沒 id 的新增）
		const toUpdate = rows.filter((row) => "id" in row);
		const toInsert = rows.filter((row) => !("id" in row));

		if (toUpdate.length > 0) {
			const { error: upsertError } = await supabase
				.from("MoreInfo")
				.upsert(toUpdate);

			if (upsertError) {
				console.error("[ERR] 更新 moreBTC 目錄失敗：", upsertError.message);
				return NextResponse.json(
					{ success: false, error: upsertError.message },
					{ status: 500 },
				);
			}
		}

		// 新增的要把 id 拿回來，否則等一下的刪除會把它們一起刪掉
		let insertedIds: number[] = [];

		if (toInsert.length > 0) {
			const { data: inserted, error: insertError } = await supabase
				.from("MoreInfo")
				.insert(toInsert)
				.select("id");

			if (insertError) {
				console.error("[ERR] 新增 moreBTC 目錄失敗：", insertError.message);
				return NextResponse.json(
					{ success: false, error: insertError.message },
					{ status: 500 },
				);
			}

			insertedIds = (inserted || []).map((row) => row.id);
		}

		// 最後才刪掉畫面上已經移除的分類
		const keepIds = [
			...toUpdate.map((row) => (row as { id: number }).id).filter(Boolean),
			...insertedIds,
		];

		const deleteQuery = supabase.from("MoreInfo").delete();
		const { error: deleteError } = await (keepIds.length > 0
			? deleteQuery.not("id", "in", `(${keepIds.join(",")})`)
			: deleteQuery.gte("id", 0));

		if (deleteError) {
			console.error("[ERR] 刪除 moreBTC 目錄失敗：", deleteError.message);
			return NextResponse.json(
				{ success: false, error: deleteError.message },
				{ status: 500 },
			);
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
