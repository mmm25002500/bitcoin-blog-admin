import type { createClient } from "@/lib/supabase/server";

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;

/**
 * 換圖後清掉舊圖：只有在沒有其他資料還指向這張圖時才刪。
 *
 * 多筆資料可能共用同一張圖（例如預設的 defaultPostImage.jpg），
 * 直接刪會讓其他文章一起破圖。要在資料更新成功「之後」呼叫，
 * 這樣被更新的那筆已經不算在內。
 *
 * 刪除失敗只記錄，不影響已經完成的更新。
 */
export async function removeImageIfUnused(
	supabase: ServerSupabaseClient,
	bucket: string,
	table: string,
	column: string,
	filename: string,
) {
	const { count, error } = await supabase
		.from(table)
		.select("id", { count: "exact", head: true })
		.eq(column, filename);

	if (error || count === null) {
		console.error("[ERR] 無法確認舊圖片是否仍在使用，先保留：", error?.message);
		return;
	}

	if (count > 0) return; // 還有其他資料在用

	const { error: removeError } = await supabase.storage
		.from(bucket)
		.remove([filename]);

	if (removeError) {
		console.error("[ERR] 刪除舊圖片失敗：", removeError.message);
	}
}

/**
 * 產生可用於 Storage 的檔名。
 *
 * Storage 的 key 不接受中文、空格等字元（會回 "Invalid key"），
 * 所以不沿用原始檔名，只保留副檔名。
 * 例："ChatGPT Image 2026年6月27日 下午05_34_49.png" → "1789218281234-a1b2c3d4.png"
 */
export function safeStorageKey(originalName: string, prefix = ""): string {
	const ext = originalName.match(/\.([a-zA-Z0-9]{1,10})$/)?.[1]?.toLowerCase();
	const random = crypto.randomUUID().slice(0, 8);
	return `${prefix}${Date.now()}-${random}${ext ? `.${ext}` : ""}`;
}
