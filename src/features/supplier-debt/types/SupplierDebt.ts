
export interface SupplierCompany {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
}

export interface Supplier {
  id: number;
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
  code?: string;
  deleted_at?: string | null;
  company?: SupplierCompany;
  created_at?: string;
  updated_at?: string;
}

export type DebtStatus = "open" | "partial" | "paid" | "overdue" | "cancelled";

export interface SupplierDebtItem {
  id: number;
  supplier_id: number;
  purchase_invoice_id: number;
  invoice_number?: string;
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
  due_date: string | null;
  status: DebtStatus;
  supplier?: Supplier;
  created_at?: string;
  updated_at?: string;
}

export interface DebtsFilterParams {
  supplier_id?: string | number;
  status?: string;
  page?: number;
  per_page?: number;
}

export interface PaginationLinkItem {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  links: PaginationLinkItem[];
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface SupplierDebtApiResponse {
  data: SupplierDebtItem[];
  links: PaginationLinks;
  meta: PaginationMeta;
}



export interface CreatedByData {
  id: number;
  first_name: string;
  last_name: string;
}

export interface DebtPayment {
  id: number;
  amount: number;
  payment_date: string;
  notes?: string | null;
  created_by?: CreatedByData;
  created_at: string;
}

export  interface PayDebtPayload {
  amount: number;
  payment_date: string;
  notes?: string;
}

export interface SupplierDebtDetailsData extends SupplierDebtItem {
  payments: DebtPayment[];
}

export interface SingleSupplierDebtApiResponse {
  data: SupplierDebtDetailsData;
}