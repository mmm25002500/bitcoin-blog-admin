import type { createClient } from "@/lib/supabase/server";
import type { ArticleButtonData } from "@/types/Article/ArticleButton";
import { MAX_ARTICLE_BUTTONS } from "@/types/Article/ArticleButton";

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;

const isRemote = (logo: string) => /^https?:\/\//.test(logo);

/**
 * 從 FormData 取出文章底部按鈕，並把新上傳的 logo 傳到 storage。
 *
 * 前端約定：
 *   buttons          -> JSON 陣列 [{ title, description, logo, link }]
 *   buttonLogo_<i>   -> 第 i 個按鈕新上傳的 logo（可省略，代表沿用 logo 欄位）
 */
export async function parseArticleButtons(
	supabase: ServerSupabaseClient,
	formData: FormData,
	bucket: string,
): Promise<{ buttons: ArticleButtonData[]; error?: string }> {
	const raw = formData.get("buttons");

	if (typeof raw !== "string" || raw.length === 0) {
		return { buttons: [] };
	}

	let parsed: ArticleButtonData[];
	try {
		parsed = JSON.parse(raw);
	} catch {
		return { buttons: [], error: "[ERR] buttons 格式錯誤" };
	}

	if (!Array.isArray(parsed)) {
		return { buttons: [], error: "[ERR] buttons 必須是陣列" };
	}

	if (parsed.length > MAX_ARTICLE_BUTTONS) {
		return {
			buttons: [],
			error: `[ERR] 按鈕最多 ${MAX_ARTICLE_BUTTONS} 個`,
		};
	}

	const buttons: ArticleButtonData[] = [];

	for (let i = 0; i < parsed.length; i++) {
		const btn = parsed[i];

		if (!btn?.title || !btn?.link) {
			return { buttons: [], error: `[ERR] 第 ${i + 1} 個按鈕缺少標題或連結` };
		}

		let logo = typeof btn.logo === "string" ? btn.logo : "";

		const file = formData.get(`buttonLogo_${i}`);
		if (file instanceof File && file.size > 0) {
			const filename = `button-${Date.now()}-${i}-${file.name}`;
			const { error: uploadError } = await supabase.storage
				.from(bucket)
				.upload(filename, file, {
					contentType: file.type,
					upsert: false,
				});

			if (uploadError) {
				return {
					buttons: [],
					error: `[ERR] 按鈕 Logo 上傳失敗：${uploadError.message}`,
				};
			}

			logo = filename;
		}

		buttons.push({
			title: btn.title,
			description: btn.description || "",
			link: btn.link,
			logo,
		});
	}

	return { buttons };
}

/** 刪掉編輯後已不再被使用、且存在 storage 的舊 logo */
export async function removeOrphanButtonLogos(
	supabase: ServerSupabaseClient,
	oldButtons: ArticleButtonData[] | null | undefined,
	newButtons: ArticleButtonData[],
	bucket: string,
) {
	if (!Array.isArray(oldButtons) || oldButtons.length === 0) return;

	const stillUsed = new Set(newButtons.map((btn) => btn.logo).filter(Boolean));
	const orphans = oldButtons
		.map((btn) => btn?.logo)
		.filter(
			(logo): logo is string =>
				typeof logo === "string" &&
				logo.length > 0 &&
				!isRemote(logo) &&
				!stillUsed.has(logo),
		);

	if (orphans.length > 0) {
		const { error } = await supabase.storage.from(bucket).remove(orphans);
		if (error) {
			console.error("[ERR] 刪除舊按鈕 Logo 失敗：", error.message);
		}
	}
}
