// app/api/News/editPost/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
	try {
		const formData = await req.formData();

		// 必填欄位
		const id = formData.get("id") as string;
		const title = formData.get("title") as string;
		const description = formData.get("description") as string;
		const tags = JSON.parse(formData.get("tags") as string);
		const type = JSON.parse(formData.get("type") as string);
		const author_id = formData.get("author_id") as string;

		// 舊的與新的檔案資訊
		const image = formData.get("image") as File | null; // 新上傳的圖片
		const filename = formData.get("filename") as string | null; // 現有的 markdown 檔名
		const markdownContent = formData.get("markdownContent") as string;

		if (!id || !title || !description || !tags || !type || !author_id) {
			return NextResponse.json(
				{ success: false, error: "[ERR] 表單資料不完整" },
				{ status: 400 },
			);
		}

		const supabase = await createClient();

		// 查舊資料
		const { data: oldData, error: fetchError } = await supabase
			.from("News")
			.select("img, filename")
			.eq("id", id)
			.single();

		if (fetchError || !oldData) {
			return NextResponse.json(
				{ success: false, error: "[ERR] 找不到舊資料" },
				{ status: 404 },
			);
		}

		let finalImg = oldData.img;

		// 如果有新圖片，就刪舊的再上傳
		if (image) {
			if (oldData.img) {
				const { error: removeError } = await supabase.storage
					.from("news.image")
					.remove([oldData.img]);

				if (removeError) {
					console.error("[ERR] 刪除舊圖片失敗：", removeError.message);
					return NextResponse.json(
						{ success: false, error: removeError.message },
						{ status: 500 },
					);
				}
			}

			finalImg = `${Date.now()}-${image.name}`;
			const { error: uploadError } = await supabase.storage
				.from("news.image")
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

		// 處理 Markdown 檔案更新
		let finalMdFilename = oldData.filename;

		if (markdownContent) {
			const mdBlob = new Blob([markdownContent], { type: "text/markdown" });

			if (filename) {
				// 有檔名：直接覆寫現有檔案
				const { error: mdUploadError } = await supabase.storage
					.from("news.article")
					.upload(filename, mdBlob, {
						contentType: "text/markdown",
						upsert: true, // 覆寫現有檔案
					});

				if (mdUploadError) {
					console.error("[ERR] Markdown 更新失敗：", mdUploadError.message);
					return NextResponse.json(
						{ success: false, error: mdUploadError.message },
						{ status: 500 },
					);
				}

				finalMdFilename = filename; // 保持原檔名
			} else {
				// 沒檔名：生成新檔名並上傳
				const timestamp = Date.now();
				const sanitizedTitle = title
					.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "-")
					.substring(0, 50);
				finalMdFilename = `${timestamp}-${sanitizedTitle}.md`;

				const { error: mdUploadError } = await supabase.storage
					.from("news.article")
					.upload(finalMdFilename, mdBlob, {
						contentType: "text/markdown",
						upsert: false,
					});

				if (mdUploadError) {
					console.error("[ERR] Markdown 上傳失敗：", mdUploadError.message);
					return NextResponse.json(
						{ success: false, error: mdUploadError.message },
						{ status: 500 },
					);
				}
			}
		}

		// 更新 News
		const { error: updateError } = await supabase
			.from("News")
			.update({
				title,
				description,
				tags,
				type,
				img: finalImg,
				filename: finalMdFilename,
				author_id,
			})
			.eq("id", id);

		if (updateError) {
			console.error("[ERR] 更新 post 失敗：", updateError.message);
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
