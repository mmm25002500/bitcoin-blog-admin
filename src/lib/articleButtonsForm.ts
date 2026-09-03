import type { ArticleButtonInput } from "@/types/Article/ArticleButton";

/**
 * 把文章底部按鈕塞進 FormData，對應後端 parseArticleButtons 的約定：
 *   buttons          -> JSON 陣列
 *   buttonLogo_<i>   -> 第 i 個按鈕新選的 logo 檔案
 */
export function appendButtonsToFormData(
	formData: FormData,
	buttons: ArticleButtonInput[],
) {
	const payload = buttons.map((btn) => ({
		title: btn.title,
		description: btn.description,
		link: btn.link,
		logo: btn.logo,
	}));

	formData.append("buttons", JSON.stringify(payload));

	buttons.forEach((btn, index) => {
		if (btn.logoFile) {
			formData.append(`buttonLogo_${index}`, btn.logoFile);
		}
	});
}

/** 送出前檢查：標題與連結必填 */
export function validateButtons(buttons: ArticleButtonInput[]): string | null {
	for (let i = 0; i < buttons.length; i++) {
		if (!buttons[i].title || !buttons[i].link) {
			return `第 ${i + 1} 個按鈕請填寫標題與連結`;
		}
	}
	return null;
}
