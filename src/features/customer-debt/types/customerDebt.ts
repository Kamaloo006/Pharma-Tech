import type { Customer } from "@/features/customers/types/Customer";


export type DebtStatus = "open" | "partial" | "paid" | "overdue" | "cancelled";


export interface UserSummary {
  id: number;
  pharmacy_id: number;
  first_name: string;
  father_name?: string | null;
  last_name: string;
  email: string;
  avatar?: string | null;
  phone_number?: string | null;
  status: string;
  is_verified: boolean;
  last_login_at?: string | null;
  created_at: string;
}

export interface CustomerDebtPayment {
  id: number;
  amount: number;
  payment_date: string;
  notes?: string | null;
  created_by?: UserSummary | null;
  created_at: string;
}

export interface PayCustomerDebtPayload {
  amount: number;
  payment_date: string;
  notes?: string | null;
}

export interface CustomerDebtDetailItem {
  id: number;
  customer_id: number;
  sales_invoice_id: number;
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
  due_date?: string | null;
  status: DebtStatus;
  customer: Customer;
  payments: CustomerDebtPayment[];
  created_at: string;
  updated_at: string;
}

export interface CustomerDebtDetailsResponse {
  data: CustomerDebtDetailItem;
}

export interface CustomerDebtItem {
  id: number;
  customer_id: number;
  sales_invoice_id: number;
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
  due_date?: string | null;
  status: DebtStatus;
  customer: Customer;
  created_at: string;
  updated_at: string;
}

export interface PaginationMetaLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: PaginationMetaLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface CustomerDebtsResponse {
  data: CustomerDebtItem[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface CustomerDebtsFilterParams {
  customer_id?: string | number;
  status?: DebtStatus | "all";
  page?: number;
  per_page?: number;
}