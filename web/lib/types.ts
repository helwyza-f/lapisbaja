export interface Registration {
  id: string;
  student_id: string;
  training_id: string;
  training_title?: string; // Field baru hasil JOIN di Go
  name: string;
  email: string;
  phone: string;
  agency: string;
  proof_url: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  created_at: string;
}

export interface PaginationMeta {
  total_data: number;
  total_page: number;
  current_page: number;
  limit: number;
}

export interface PagedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}
