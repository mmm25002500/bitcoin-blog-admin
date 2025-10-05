import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
	try {
		const { ids } = await req.json();
		if (!ids || !Array.isArray(ids)) {
			return NextResponse.json(
				{ success: false, error: "無效的刪除 ID 列表" },
				{ status: 400 },
			);
		}

		const supabase = await createClient();

		// 取得對應 post 的圖片檔名和 Markdown 檔名
		const { data: posts, error: fetchError } = await supabase
			.from("News")
			.select("id, img, filename")
			.in("id", ids);

		if (fetchError) {
			console.error("[ERR] 取得檔案資料失敗：", fetchError.message);
			return NextResponse.json(
				{ success: false, error: fetchError.message },
				{ status: 500 },
			);
		}

		// 刪除圖片
		const imageFilenames = posts.map((p) => p.img).filter(Boolean);
		if (imageFilenames.length > 0) {
			const { data: removed, error: imageDeleteError } = await supabase.storage
				.from("news.image")
				.remove(imageFilenames);

			if (imageDeleteError) {
				console.error("[ERR] 圖片刪除失敗：", imageDeleteError.message);
				// 不中斷流程
			} else {
				console.log("成功刪除圖片：", removed);
			}
		}

		// 刪除 Markdown 檔案
		const mdFilenames = posts.map((p) => p.filename).filter(Boolean);
		if (mdFilenames.length > 0) {
			const { data: removedMd, error: mdDeleteError } = await supabase.storage
				.from("news.article")
				.remove(mdFilenames);

			if (mdDeleteError) {
				console.error("[ERR] Markdown 刪除失敗：", mdDeleteError.message);
				// 不中斷流程
			} else {
				console.log("成功刪除 Markdown：", removedMd);
			}
		}

		// 刪除 post 資料
		const { error: deletePostError } = await supabase
			.from("News")
			.delete()
			.in("id", ids);

		if (deletePostError) {
			return NextResponse.json(
				{ success: false, error: deletePostError.message },
				{ status: 500 },
			);
		}

		return NextResponse.json({ success: true });
	} catch (err) {
		console.error("[ERR] 發生刪除錯誤：", err);
		return NextResponse.json(
			{ success: false, error: "伺服器錯誤" },
			{ status: 500 },
		);
	}
}
