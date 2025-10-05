// app/api/author/editAuthor/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// TODO:
// 1. 儲存功能（optional）

export async function POST(req: Request) {
	try {
		const formData = await req.formData();

		// 必填欄位
		const id = formData.get("id") as string;
		// const fullname = formData.get("fullname") as string;
		const name = formData.get("name") as string;
		const description = formData.get("description") as string;

		// 舊的與新的圖片資訊
		const image = formData.get("image") as File | null; // 新上傳的檔案
		// const img = formData.get("img") as string | null; // 舊的圖片檔名（storage key）

		console.log("[Server] Data: ", {
			id,
			// fullname,
			name,
			description,
			image,
		});

		if (!name || !description) {
			return NextResponse.json(
				{ success: false, error: "[ERR] 表單資料不完整" },
				{ status: 400 },
			);
		}

		const supabase = await createClient();

		// 查舊資料
		const { data: oldData, error: fetchError } = await supabase
			.from("author")
			.select("image")
			.eq("id", id)
			.single();

		if (fetchError || !oldData) {
			return NextResponse.json(
				{ success: false, error: "[ERR] 找不到舊資料" },
				{ status: 404 },
			);
		}

		let finalImg = oldData.image;

		// 如果有新圖片，就刪舊的再上傳
		if (image) {
			if (oldData.image) {
				const { error: removeError } = await supabase.storage
					.from("author.image")
					.remove([oldData.image]);

				if (removeError) {
					console.error("[ERR] 刪除舊圖片失敗：", removeError.message);
					return NextResponse.json(
						{ success: false, error: removeError.message },
						{ status: 500 },
					);
				}
			}

			// image filename
			finalImg = `${Date.now()}-${image.name}`;

			// upload image
			const { error: uploadError } = await supabase.storage
				.from("author.image")
				.upload(finalImg, image, {
					contentType: image.type,
					upsert: false,
				});

			if (uploadError) {
				console.error("[ERR] 圖片上傳失敗：", uploadError.message);
				return NextResponse.json(
					{ success: false, error: uploadError.message },
					{ status: 500 },
				);
			}
		}

		// 更新 Author（filename 永遠照樣更新，不管圖片有沒有換）
		const { error: updateError } = await supabase
			.from("author")
			.update({
				description,
				name,
				image: finalImg,
			})
			.eq("id", id);

		if (updateError) {
			console.error("[ERR] 更新 author 失敗：", updateError.message);
			return NextResponse.json(
				{ success: false, error: updateError.message },
				{ status: 500 },
			);
		}

		return NextResponse.json({ success: true });
	} catch (err) {
		console.error("[ERR] 發生例外錯誤：", err);
		const message = err instanceof Error ? err.message : "[ERR] 未知錯誤";
		return NextResponse.json(
			{ success: false, error: message },
			{ status: 500 },
		);
	}
}
