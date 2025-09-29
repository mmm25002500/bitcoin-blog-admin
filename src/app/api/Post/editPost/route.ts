import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
	try {
		const formData = await req.formData();

		const id = formData.get("id") as string; // 必填，Post 的 id
		const title = formData.get("title") as string;
		const description = formData.get("description") as string;
		const tags = JSON.parse(formData.get("tags") as string);
		const type = JSON.parse(formData.get("type") as string);
		const image = formData.get("image") as File | null; // 可能沒換
		const filename = formData.get("filename") as string | null;
		const author_id = formData.get("author_id") as string;

		if (!id || !title || !description || !tags || !type || !author_id) {
			return NextResponse.json(
				{ success: false, error: "[ERR] 表單資料不完整" },
				{ status: 400 },
			);
		}

		const supabase = await createClient();

		console.log("Received form data:", {
			id,
			title,
			description,
			tags,
			type,
			image: image
				? { name: image.name, type: image.type, size: image.size }
				: null,
			filename,
			author_id,
		});

		// 先查原本資料
		const { data: oldData, error: fetchError } = await supabase
			.from("Post")
			.select("img, filename")
			.eq("id", id)
			.single();

		if (fetchError || !oldData) {
			return NextResponse.json(
				{ success: false, error: "[ERR] 找不到舊資料" },
				{ status: 404 },
			);
		}

		let finalFilename = oldData.img; // 預設用舊的
		let originalFilename = oldData.filename;

		if (image && filename) {
			// 如果有新圖片，先刪除舊的
			if (oldData.img) {
				const { error: removeError } = await supabase.storage
					.from("post.image")
					.remove([oldData.img]);

				if (removeError) {
					console.error("[ERR] 刪除舊圖片失敗：", removeError.message);
					return NextResponse.json(
						{ success: false, error: removeError.message },
						{ status: 500 },
					);
				}
			}

			// 上傳新圖片
			finalFilename = `${Date.now()}-${filename}`;
			const { error: uploadError } = await supabase.storage
				.from("post.image")
				.upload(finalFilename, image, {
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

			originalFilename = filename;
		}

		// 更新 Post
		const { error: updateError } = await supabase
			.from("Post")
			.update({
				title,
				description,
				tags,
				type,
				img: finalFilename,
				filename: originalFilename,
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
		let message = "[ERR] 未知錯誤";
		if (err instanceof Error) message = err.message;
		return NextResponse.json(
			{ success: false, error: message },
			{ status: 500 },
		);
	}
}
