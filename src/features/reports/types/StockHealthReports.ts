export interface StockHealthProduct {
  product_id: number;
  brand_name: string;
  ar_name: string;
  category: string;
  current_stock: number;
  expiry_date?: string;
  days_until_expiry?: number;
}

export interface StockHealthSummary {
  expiring_soon_count: number;
  low_stock_count: number;
  dead_stock_count: number;
  healthy_count?: number; 
}

export interface StockHealthData {
  expiry_days: number;
  summary: StockHealthSummary;
  expiring_soon: StockHealthProduct[];
  low_stock: StockHealthProduct[];
  dead_stock: StockHealthProduct[];
}

export interface StockHealthResponse {
  data: StockHealthData;
}

export interface StockHealthParams {
  expiry_days?: number;
}