export interface CategoryResponseItem {
  id: number;
  name: string;
  description: string;
  deleted_at: string | null;
  products_count: number;
  created_at: string;
  updated_at: string;
}

export interface CategoriesResponse {
  data: CategoryResponseItem[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}