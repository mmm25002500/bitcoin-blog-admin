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

		// 先取得對應作者的圖片檔名
		const { data: authors, error: fetchError } = await supabase
			.from("author")
			.select("id, image")
			.in("id", ids);

		if (fetchError) {
			return NextResponse.json(
				{ success: false, error: fetchError.message },
				{ status: 500 },
			);
		}

		// 刪除圖片
		const filenames = authors
			.map((a) => a.image?.replace("author.image/", "").trim())
			.filter(Boolean);
		if (filenames.length > 0) {
			const { data: removedData, error: deleteImageError } =
				await supabase.storage.from("author.image").remove(filenames);

			// console.log("圖片刪除回應 data:", removedData);

			if (deleteImageError) {
				console.error("圖片刪除失敗：", deleteImageError.message);
				// 圖片刪除錯誤不中斷流程，可選擇只記錄
			}
		}

		// 刪除資料表記錄
		const { error: deleteRowError } = await supabase
			.from("author")
			.delete()
			.in("id", ids);

		if (deleteRowError) {
			return NextResponse.json(
				{ success: false, error: deleteRowError.message },
				{ status: 500 },
			);
		}

		return NextResponse.json({ success: true });
	} catch (err) {
		console.error("[ERR] 刪除時發生錯誤：", err);
		return NextResponse.json(
			{ success: false, error: "伺服器錯誤" },
			{ status: 500 },
		);
	}
}
