import type { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const unauthorized = () =>
	NextResponse.json({ success: false, error: "未授權訪問" }, { status: 401 });

/**
 * 讀取路由用：立刻送出驗證請求但先不等它，讓查詢同時進行，
 * 在回傳結果前才 await。可省下一趟往返（getUser 約 100ms）。
 *
 * 注意要用獨立的 client：跟查詢共用同一個 client 的話，查詢會卡在
 * auth lock 等 getUser 放鎖，又變回序列。
 *
 * 用法：
 *   const auth = beginAuth();
 *   ...查詢...
 *   const denied = await auth;
 *   if (denied) return denied;
 */
export function beginAuth(): Promise<NextResponse | null> {
	return (async () => {
		const supabase = await createClient();
		const { data, error } = await supabase.auth.getUser();

		if (error || !data?.user) return unauthorized();
		return null;
	})();
}

/**
 * 寫入路由用：先驗證再執行，不能並行（不可未授權就先動到資料）。
 */
export async function requireUser(): Promise<
	| { supabase: SupabaseClient; error: null }
	| { supabase: null; error: NextResponse }
> {
	const supabase = await createClient();
	const { data, error } = await supabase.auth.getUser();

	if (error || !data?.user) return { supabase: null, error: unauthorized() };
	return { supabase, error: null };
}
