import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// TODO:
// 1. 新增 markdown 上傳功能（判斷式）
// 2. 更改 markdown 功能（判斷式）

export async function POST(req: Request) {
	try {
		const formData = await req.formData();

		const title = formData.get("title") as string;
		const description = formData.get("description") as string;
		const tags = JSON.parse(formData.get("tags") as string); // tags 是 JSON 字串，例如：["科技", "新聞"]
		const type = JSON.parse(formData.get("type") as string); // type 也是 JSON 字串，例如：["文章"]
		const image = formData.get("image") as File;
		const filename = formData.get("filename") as string;
		const author_id = formData.get("author_id") as string;

		if (
			!title ||
			!description ||
			!tags ||
			!type ||
			!image ||
			!filename ||
			!author_id
		) {
			return NextResponse.json(
				{ success: false, error: "[ERR] 表單資料不完整" },
				{ status: 400 },
			);
		}

		const supabase = await createClient();

		// 上傳圖片
		const finalFilename = `${Date.now()}-${filename}`;
		const { error: uploadError } = await supabase.storage
			.from("news.image")
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

		// 插入 news 資料
		const { error: insertError } = await (await supabase).from("News").insert({
			title,
			description,
			tags,
			type,
			img: finalFilename,
			filename: filename,
			author_id,
		});
		console.log("插入 news 資料：", {
			title,
			description,
			tags: `"${tags}"`,
			type: `"${type}"`,
			img: finalFilename,
			filename: filename,
			author_id,
		});

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
