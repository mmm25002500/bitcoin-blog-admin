import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { fullname, name, description, image } = body;

		const supabase = createClient();
		const { error } = await (await supabase).from("author").insert({
			fullname,
			name,
			description,
			image,
		});

		if (error) {
			console.error("❌ Supabase 插入失敗：", error.message);
			return NextResponse.json(
				{ success: false, error: error.message },
				{ status: 500 },
			);
		}

		return NextResponse.json({ success: true });
	} catch (err: unknown) {
		console.error("❌ 發生例外錯誤：", err);

		let message = "未知錯誤";
		if (err instanceof Error) {
			message = err.message;
		}
		return NextResponse.json(
			{ success: false, error: message },
			{ status: 500 },
		);
	}
}
