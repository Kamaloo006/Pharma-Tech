export interface TopProduct {
  rank: number;
  product_id: number;
  brand_name: string;
  ar_name: string;
  category: string;
  selling_price: number;
  buying_price: number;
  total_units_sold: number;
  total_revenue: number;
}

export interface TopProductsReportData {
  date_from: string;
  date_to: string;
  limit: number;
  products: TopProduct[];
}

export interface TopProductsReportResponse {
  data: TopProductsReportData;
}

export interface TopProductsQueryParams {
  date_from?: string;
  date_to?: string;
  limit?: number;
}