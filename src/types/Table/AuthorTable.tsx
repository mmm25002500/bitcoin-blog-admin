// firebase 的
// export interface AuthorData {
//   id: string;
//   name: string;
//   postQuantity: number;
//   description: string;
//   image: string;
// }

// supabase 的
export interface AuthorData {
	id: string;
	created_at: string;
	fullname: string;
	name: string;
	description: string;
	image: string;
	postQuantity?: number; // optional, 如果 Supabase 沒這欄位
}

export interface AuthorTableProps {
	perPage?: number;
	searchValue?: string;
	// onPerPageChange?: (perPage: number) => void;
	// currentPage?: number;
	// handlePageChange?: (page: number) => void;
	onDelete?: (ids: string[]) => void;
	AuthorData: AuthorData[];
}
