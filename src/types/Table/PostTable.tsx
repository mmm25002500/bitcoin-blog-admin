import type { DateRange } from "react-day-picker";

export interface PostData {
	id: string;
	title: string;
	created_at: string;
	description?: string;
	tags: string[];
	type: string[]; // 類似小書櫃
	img: string;
	filename: string;
	author_id: string; //uuid
}

export interface PostTableProps {
	perPage?: number;
	searchValue?: string;
	type?: string;
	date?: DateRange;
	// onPerPageChange?: (perPage: number) => void;
	// currentPage?: number;
	// handlePageChange?: (page: number) => void;
	onDelete?: (ids: string[]) => void;
	PostData: PostData[];
}
