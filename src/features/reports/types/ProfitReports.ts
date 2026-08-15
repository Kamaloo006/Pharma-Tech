export interface ProfitProduct {
  product_id: number;
  brand_name: string;
  ar_name: string;
  category: string;
  total_units_sold: number;
  avg_cost_price: number;
  selling_price: number;
  price_difference: number;
  total_revenue: number;
  total_cost: number;
  total_profit: number;
  profit_margin: number;
}

export interface ProfitSummary {
  total_revenue: number;
  total_cost: number;
  total_profit: number;
  overall_margin: number;
}

export interface ProfitReportData {
  date_from: string;
  date_to: string;
  summary: ProfitSummary;
  products: ProfitProduct[];
}

export interface ProfitReportResponse {
  data: ProfitReportData;
}

export interface ProfitReportParams {
  date_from: string;
  date_to: string;
}