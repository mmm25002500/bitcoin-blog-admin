// app/api/pageRoute/getRoutes/route.ts
import { NextResponse } from "next/server";
import { beginAuth } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
	try {
		const auth = beginAuth();
		const supabase = await createClient();

		const { data, error } = await supabase
			.from("PageRoute")
			.select("key, label, path, sort_order")
			.order("sort_order", { ascending: true });

		const denied = await auth;
		if (denied) return denied;

		if (error) {
			console.error("[ERR] 取得網址設定失敗：", error.message);
			return NextResponse.json(
				{ success: false, error: error.message },
				{ status: 500 },
			);
		}

		return NextResponse.json({ success: true, data }, { status: 200 });
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : "未知錯誤";
		console.error("[ERR] 發生例外錯誤：", errorMessage);

		return NextResponse.json(
			{ success: false, error: errorMessage },
			{ status: 500 },
		);
	}
}
