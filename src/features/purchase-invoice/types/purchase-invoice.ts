import type { Product } from "@/features/inventory/types/Product";
import type { Supplier } from "@/features/suppliers/types/Supplier";

export interface User {
  id: number;
  pharmacy_id: number;
  first_name: string;
  father_name: string;
  last_name: string;
  email: string;
  avatar: string | null;
  phone_number: string;
  status: 'active' | 'inactive';
  is_verified: boolean;
  last_login_at: string | null;
  created_at: string;
}

export interface InvoiceFilters {
  supplier_id?: string;
  status?: string;
  search?:string;
  payment_status?: string;
  from_date?: string;
  to_date?: string;
}

export interface SupplierDebtPayment {
  id: number;
  cash_transaction_id: number;
  amount: number;
  payment_date: string;
  notes: string | null;
  created_by?: User;
  created_at: string;
}

export interface SupplierDebt {
  id: number;
  supplier_id: number;
  purchase_invoice_id: number;
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
  due_date: string | null;
  status: 'paid' | 'partial' | 'unpaid';
  payments?: SupplierDebtPayment[];
  created_at: string;
  updated_at: string;
}

export interface PurchaseInvoiceItemResource {
  id: number;
  product_id: number;
  quantity: number;
  wholesale_price: number;
  tax: number;
  discount: number;
  line_total: number;
  product?: Product;
}

export interface PurchaseInvoice {
  id: number;
  invoice_number: string;
  invoice_date: string;
  subtotal: number;
  tax_total: number;
  discount_total: number;
  grand_total: number;
  amount_paid: number;
  amount_due: number;
  payment_method: 'cash' | 'debt' | 'credit'; 
  payment_status: 'paid' | 'partial' | 'unpaid';
  status: 'completed' | 'cancelled';
  notes: string | null;
  supplier?: Supplier;
  created_by?: User;
  items?: PurchaseInvoiceItemResource[];
  supplier_debt?: SupplierDebt | null;
  created_at: string;
  updated_at: string;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
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

export interface PurchaseInvoicesResponse {
  data: PurchaseInvoice[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface InvoiceItem {
  id: string; 
  product_id: number;
  brand_name: string;
  scientific_name: string;
  strength: string;
  quantity: number;
  wholesale_price: number; 
  tax: number;
  discount: number;
  batch_number: string;
  expiry_date: string;
  selling_price: number;
}

export interface CreatePurchaseInvoicePayload {
  supplier_id: number;
  invoice_date: string;
  payment_method: 'cash' | 'credit' | 'debt';
  amount_paid: number;
  notes?: string | null;
  items: {
    product_id: number;
    quantity: number;
    wholesale_price: number;
    tax: number;
    discount: number;
    batch_number: string;
    expiry_date: string;
  }[];
}