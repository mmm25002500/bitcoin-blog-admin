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
