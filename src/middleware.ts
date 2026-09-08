import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
	return await updateSession(request);
}

export const config = {
	matcher: [
		/*
		 * 略過不需要驗證的路徑：
		 * - api：改由各路由自己驗（見 lib/supabase/auth.ts），
		 *   讀取路由可以把驗證與查詢並行，省一趟往返
		 * - _next/static、_next/image：建置產物
		 * - favicon.ico 與各種圖片副檔名
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
