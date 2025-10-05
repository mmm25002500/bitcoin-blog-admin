import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
	try {
		const formData = await req.formData();

		const fullname = formData.get("fullname") as string;
		const name = formData.get("name") as string;
		const description = formData.get("description") as string;
		const image = formData.get("image") as File;

		if (!fullname || !name || !description || !(image instanceof File)) {
			return NextResponse.json(
				{ success: false, error: "[ERR] 表單資料不完整" },
				{ status: 400 },
			);
		}

		const supabase = createClient();

		// 驗證使用者身份
		const {
			data: { user },
			error: authError,
		} = await (await supabase).auth.getUser();

		if (authError || !user) {
			return NextResponse.json(
				{ success: false, error: "未授權訪問" },
				{ status: 401 },
			);
		}

		// 上傳圖片到 Supabase Storage
		const filename = `${Date.now()}-${image.name}`;
		const { error: uploadError } = await (await supabase).storage
			.from("author.image")
			.upload(filename, image, {
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

		// 取得 public 圖片 URL
		// const { data: urlData } = (await supabase).storage
		// 	.from("author.image")
		// 	.getPublicUrl(filename);
		const imageUrl = filename;

		// 插入作者資料到資料庫
		const { error: insertError } = await (await supabase)
			.from("author")
			.insert({
				fullname,
				name,
				description,
				image: imageUrl,
			});

		if (insertError) {
			console.error("[ERR] 插入作者失敗：", insertError.message);
			return NextResponse.json(
				{ success: false, error: insertError.message },
				{ status: 500 },
			);
		}

		return NextResponse.json({ success: true });
	} catch (err: unknown) {
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
