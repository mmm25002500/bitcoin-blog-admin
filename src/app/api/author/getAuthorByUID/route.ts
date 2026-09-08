import { beginAuth } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const UUID_RE =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: NextRequest) {
	// 驗證與下面的查詢並行送出，回傳前才收
	const auth = beginAuth();

	const supabase = await createClient();

	const body = await req.json().catch(() => null);
	const uid = body?.uid;

	// 格式不對就別送進 DB，否則 Postgres 會丟 22P02 變成 500
	if (typeof uid !== "string" || !UUID_RE.test(uid)) {
		const denied = await auth;
		if (denied) return denied;

		return NextResponse.json(
			{ success: false, error: uid ? "uid 格式錯誤" : "缺少 uid" },
			{ status: 400 },
		);
	}

	const { data, error } = await supabase
		.from("author")
		.select("*")
		.eq("id", uid)
		.maybeSingle();

	// 查詢已經送出，這時才收驗證結果
	const denied = await auth;
	if (denied) return denied;

	if (error) {
		// 不把 Postgres 的原始訊息往外吐
		console.error("[ERR] 查詢作者失敗：", error.message);
		return NextResponse.json(
			{ success: false, error: "查詢作者失敗" },
			{ status: 500 },
		);
	}

	if (!data) {
		return NextResponse.json(
			{ success: false, error: "找不到作者" },
			{ status: 404 },
		);
	}

	return NextResponse.json({ success: true, data }, { status: 200 });
}
