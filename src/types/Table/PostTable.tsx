import { DateRange } from "react-day-picker";

export interface PostData {
  id: string;
  title: string;
  author: string;
  date: string;
  tag: string;
  type: string;
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
};