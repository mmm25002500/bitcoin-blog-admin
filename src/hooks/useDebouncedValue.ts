"use client";

import { useEffect, useState } from "react";

/**
 * 延遲回傳 value，停止變動 delay 毫秒後才更新。
 * 用在搜尋框：輸入框本身即時反應，但篩選與重繪等打完才做。
 */
export function useDebouncedValue<T>(value: T, delay = 250): T {
	const [debounced, setDebounced] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(timer);
	}, [value, delay]);

	return debounced;
}
