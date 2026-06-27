export interface Category {
  id: number;
  name: string;
  description: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  brand_name: string;
  selling_price: number;
  base_unit: string;
  min_stock: number;
  total_quantity: number;
  nearest_expiry: string | null; 
  stock_status: "available" | "low" | "out";
  stock_alert_severity: "none" | "low" | "medium" | "high";
  category?: {
    id: number;
    name: string;
    description: string;
  };
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface ProductFilters {
  search?: string;
  category_id?: string;
  prescription_required?: string;
  stock_status?: "all" | "available" | "low" | "out";
  with_trashed?: boolean;
  page: number;
  per_page: number;
}
