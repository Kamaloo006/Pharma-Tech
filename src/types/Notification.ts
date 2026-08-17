export interface NotificationData {
  type:
    | "sale_invoice_created"
    | "purchase_invoice_created"
    | "customer_debt_created"
    | "customer_debt_payment"
    | "supplier_debt_created"
    | "supplier_debt_payment"
    | "customer_return_created"
    | "supplier_return_created"
    | "low_stock_alert"
    | "product_alert"
    | string;
  pharmacy_id?: number;
  invoice_number?: string;
  grand_total?: number;
  amount_paid?: number;
  amount_due?: number;
  payment_status?: string;
  sales_invoice_id?: number;
  customer_return_invoice_id?: number;
  supplier_return_invoice_id?: number;
  product_id?:number;
  purchase_invoice_id?: number;
  supplier_id?: number;
  supplier_debt_id?: number;
  customer_id?: number | null;
  customer_debt_id?: number;
  amount?: number;
  remaining_amount?: number;
  status?: string;
  created_by?: number;
}

export interface NotificationItem {
  id: number;
  user_id: number;
  title: string;
  body: string;
  data: NotificationData;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationsResponse {
  current_page: number;
  data: NotificationItem[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}