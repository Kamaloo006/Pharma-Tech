import type { Customer } from "@/features/customers/types/Customer";

export type PaymentStatus = "paid" | "partial" | "unpaid";
export type PaymentMethod = "cash" | "card" | "debt" | string;
export type InvoiceStatus = "completed" | "pending" | "cancelled" | string;



export interface User {
  id: number;
  pharmacy_id: number;
  first_name: string;
  father_name: string;
  last_name: string;
  email: string;
  avatar: string | null;
  phone_number: string;
  status: string;
  is_verified: boolean;
  last_login_at: string | null;
  created_at: string;
}

export interface SalesInvoice {
  id: number;
  invoice_number: string;
  invoice_date: string;
  subtotal: number;
  tax_total: number;
  discount_total: number;
  grand_total: number;
  amount_paid: number;
  amount_due: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  status: InvoiceStatus;
  notes: string | null;
  customer: Customer | null;
  customer_debt: unknown | null;
  created_by: User;
  created_at: string;
  updated_at: string;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface MetaLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: MetaLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface SalesInvoicesApiResponse {
  data: SalesInvoice[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface SalesInvoiceFilters {
  page?: number;
  per_page?: number;
  status?: string;
  payment_status?: string;
  payment_method?: string;
  customer_id?: number | string;
  date_from?: string;
  date_to?: string;
}

export interface SalesInvoiceItem {
  id: string ;
  product_id: number;
  brand_name: string;
  scientific_name: string;
  strength: string;
  selling_price: number;
  quantity: number;
  tax: number;
  discount: number;
  stock: number;
}

export interface CreateSalesInvoicePayload {
  customer_id: number | null;
  invoice_date?: string;
  payment_method: "cash" | "credit" | "debt";
  amount_paid: number;
  due_date?: string | null;
  notes?: string | null;
  items: {
    product_id: number;
    quantity: number;
    selling_price: number;
    tax: number;
    discount: number;
  }[];
}