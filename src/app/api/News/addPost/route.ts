import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
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

		const formData = await req.formData();

		const title = formData.get("title") as string;
		const description = formData.get("description") as string;
		const tags = JSON.parse(formData.get("tags") as string); // tags 是 JSON 字串，例如：["科技", "新聞"]
		const type = JSON.parse(formData.get("type") as string); // type 也是 JSON 字串，例如：["文章"]
		const image = formData.get("image") as File;
		const author_id = formData.get("author_id") as string;
		const markdownContent = formData.get("markdownContent") as string;

		if (!title || !description || !tags || !type || !image || !author_id) {
			return NextResponse.json(
				{ success: false, error: "[ERR] 表單資料不完整" },
				{ status: 400 },
			);
		}

		// 生成檔名
		const timestamp = Date.now();
		const sanitizedTitle =
			title
				.replace(/[^a-zA-Z0-9]/g, "-") // 只保留英文、數字
				.replace(/-+/g, "-") // 合併多個連字號
				.replace(/^-|-$/g, "") // 移除開頭和結尾的連字號
				.substring(0, 50) || "untitled"; // 如果完全沒有英數字，用 untitled
		const imageFilename = `${timestamp}-${image.name}`;
		const mdFilename = `${timestamp}-${sanitizedTitle}.md`;

		// 上傳圖片
		const { error: uploadError } = await supabase.storage
			.from("news.image")
			.upload(imageFilename, image, {
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

		// 上傳 Markdown 檔案
		if (markdownContent) {
			const mdBlob = new Blob([markdownContent], { type: "text/markdown" });
			const { error: mdUploadError } = await supabase.storage
				.from("news.article")
				.upload(mdFilename, mdBlob, {
					contentType: "text/markdown",
					upsert: false,
				});

			if (mdUploadError) {
				// 如果 Markdown 上傳失敗，刪除已上傳的圖片
				await supabase.storage.from("news.image").remove([imageFilename]);
				console.error("[ERR] Markdown 上傳失敗：", mdUploadError.message);
				return NextResponse.json(
					{ success: false, error: mdUploadError.message },
					{ status: 500 },
				);
			}
		}

		// 插入 news 資料
		const { error: insertError } = await (await supabase).from("News").insert({
			title,
			description,
			tags,
			type,
			img: imageFilename,
			filename: mdFilename,
			author_id,
		});
		// console.log("插入 news 資料：", {
		// 	title,
		// 	description,
		// 	tags: `"${tags}"`,
		// 	type: `"${type}"`,
		// 	img: imageFilename,
		// 	filename: mdFilename,
		// 	author_id,
		// });

		if (insertError) {
			console.error("[ERR] 插入 news 失敗：", insertError.message);
			return NextResponse.json(
				{ success: false, error: insertError.message },
				{ status: 500 },
			);
		}

		return NextResponse.json({ success: true });
	} catch (err) {
		console.error("[ERR] 發生例外錯誤：", err);

		let message = "[ERR] 未知錯誤";
		if (err instanceof Error) {
			message = err.message;
		}
		return NextResponse.json(
			{ success: false, error: message },
			{ status: 500 },
		);
	}
}
