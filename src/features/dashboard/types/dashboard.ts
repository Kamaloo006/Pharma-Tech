export interface HeaderData {
  today_revenue: number;
  today_revenue_change_percent: number;
  today_invoice_count: number;
  today_avg_invoice: number;
  today_units_sold: number;
}

export interface DashboardCardsResponse {
  yesterday_revenue: number;
  yesterday_week_change_percent: number;
  total_products: number;
  in_stock_products: number;
  stock_alerts_count: number;
  out_of_stock_count: number;
  today_sales_count: number;
  today_sales_change_percent: number;
}

export interface HeaderResponse {
  data: HeaderData;
}

export interface WeeklyRevenueItem {
  date: string;
  day: string;
  revenue: number;
  is_today: boolean;
}

export interface WeeklyRevenueResponse {
  data: WeeklyRevenueItem[];
}

export type TransactionType = 'sale' | 'purchase' | 'customer_return' | 'supplier_return';

export type PaymentStatus = 'paid' | 'unpaid' | 'partial' | 'completed' | 'pending';

export interface TransactionItem {
  id: number;
  type: TransactionType;
  invoice_number: string;
  invoice_date: string;
  amount: string; 
  payment_status: PaymentStatus;
  created_at: string;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export type DashboardTransactionsResponse = PaginatedResponse<TransactionItem>;