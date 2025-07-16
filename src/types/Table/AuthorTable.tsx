// firebase 的
// export interface AuthorData {
//   id: string;
//   name: string;
//   postQuantity: number;
//   description: string;
//   image: string;
// }

import type { AuthorData } from "../Author/Author";

export interface AuthorTableProps {
	perPage?: number;
	searchValue?: string;
	// onPerPageChange?: (perPage: number) => void;
	// currentPage?: number;
	// handlePageChange?: (page: number) => void;
	onDelete?: (ids: string[]) => void;
	AuthorData: AuthorData[];
}
