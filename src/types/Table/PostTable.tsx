export interface PostData {
  id: string;
  title: string;
  author: string;
  date: string;
  tag: string;
  type: "News" | "Post";
}
export interface PostTableProps {
  perPage?: number;
  // onPerPageChange?: (perPage: number) => void;
  // currentPage?: number;
  // handlePageChange?: (page: number) => void;
  onDelete?: (ids: string[]) => void;
  PostData: PostData[];
};