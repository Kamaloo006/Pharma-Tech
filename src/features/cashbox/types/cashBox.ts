export interface CashBox {
  id: number;
  opening_balance: number;
  current_balance: number;
  created_at: string;
  updated_at: string;
}

export interface CashBoxStats {
  today: { in: number; out: number };
  week: { in: number; out: number };
  month: { in: number; out: number };
}

export interface Transaction {
  id: number;
  transaction_type: 'purchase_out' | 'sale_in' | 'customer_return_out' | 'supplier_return_in' | 'customer_debt_payment_in' | 'supplier_debt_payment_out' | 'manual_in' | 'manual_out';
  amount: number;
  reference_type: string;
  reference_id: number;
  notes: string | null;
  transaction_time: string;
  balance_after: number | null;
  created_by: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  created_at: string;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface TransactionsFilterParams {
  page: number;
  per_page: string;
  type: 'purchase_out' | 'sale_in' | 'customer_return_out' | 'supplier_return_in' | 'customer_debt_payment_in' | 'supplier_debt_payment_out' | 'manual_in' | 'manual_out' | 'all';
  search: string;
  date_from: string;
  date_to: string;
}