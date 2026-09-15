/**
 * 文章／新聞自訂網址（slug）的整理與檢查。
 * 規則要跟資料庫的 Post_slug_format / News_slug_format 一致。
 */
export function normalizeSlug(raw: FormDataEntryValue | null): {
	slug: string | null;
	error: string | null;
} {
	const slug = typeof raw === "string" ? raw.trim() : "";

	if (!slug) return { slug: null, error: null };

	if (/[/?#%.\s]/.test(slug)) {
		return { slug: null, error: "[ERR] 網址不能包含 / ? # % . 或空白" };
	}

	if (/^[0-9]+$/.test(slug)) {
		return {
			slug: null,
			error: "[ERR] 網址不能是純數字（純數字保留給文章編號）",
		};
	}

	return { slug, error: null };
}

/**
 * 改網址時把舊的記下來，前台用舊網址進來會轉到新的。
 */
export function nextOldSlugs(
	oldSlug: string | null,
	oldSlugs: string[] | null,
	newSlug: string | null,
): string[] {
	const list = new Set(oldSlugs ?? []);
	if (oldSlug && oldSlug !== newSlug) list.add(oldSlug);
	if (newSlug) list.delete(newSlug);
	return [...list];
}

/**
 * 網址重複（unique 衝突）時給看得懂的訊息。
 */
export function slugErrorMessage(error: {
	code?: string;
	message: string;
}): string {
	if (error.code === "23505" && error.message.includes("slug")) {
		return "[ERR] 這個網址已經被其他文章使用";
	}
	return error.message;
}
