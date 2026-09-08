import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
	return await updateSession(request);
}

export const config = {
	matcher: [
		/*
		 * 略過不需要驗證的路徑：
		 * - _next/static、_next/image：建置產物
		 * - favicon.ico 與各種圖片副檔名
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
