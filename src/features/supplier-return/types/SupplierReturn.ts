import type { Product } from "@/features/inventory/types/Product";

export type ReturnStatus = "completed" | "pending" | "cancelled" | "approved";
export type RefundMethod = "cash" | "credit" | "bank_transfer" | string;

export interface Company {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
}

export interface Supplier {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string | null;
  deleted_at: string | null;
  company?: Company;
  created_at?: string;
  updated_at?: string;
}

export interface CreatedBy {
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
}

export interface SupplierReturnInvoice {
  id: number;
  invoice_number: string;
  invoice_date: string;
  subtotal: number;
  tax_total: number;
  discount_total: number;
  refund_total: number;
  refund_method: RefundMethod;
  status: ReturnStatus;
  reason: string | null;
  notes: string | null;
  supplier: Supplier;
  original_purchase_invoice_id: number | null;
  created_by: CreatedBy;
  created_at: string;
  updated_at: string;
}

export interface MetaPagination {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export interface SupplierReturnApiResponse {
  data: SupplierReturnInvoice[];
  links: Record<string, string | null>;
  meta: MetaPagination;
}

export interface SupplierReturnFilterParams {
  status?: string;
  supplier_id?: string;
  date_from?: string;
  date_to?: string;
  per_page?: number;
  page?: number;
}




export interface SupplierReturnItemInput {
  product_id: number;
  quantity: number;
  unit_price: number;
  tax: number;
  discount: number;
}

export interface CreateSupplierReturnPayload {
  supplier_id: number;
  original_purchase_invoice_id: number;
  invoice_date: string;
  refund_method: "cash" | "credit";
  reason?: string;
  notes?: string;
  items: SupplierReturnItemInput[];
}

export interface SupplierReturnItemResponse {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  tax: number;
  discount: number;
  line_total: number;
  created_at: string;
}

export interface SupplierReturnResponse {
  id: number;
  invoice_number: string;
  invoice_date: string;
  subtotal: number;
  tax_total: number;
  discount_total: number;
  refund_total: number;
  refund_method: "cash" | "credit";
  status: string;
  reason?: string;
  notes?: string;
  original_purchase_invoice_id: number;
  items: SupplierReturnItemResponse[];
  created_at: string;
  updated_at: string;
}

export interface SupplierReturnSingleApiResponse {
  data: SupplierReturnResponse;
}


export interface ReturnItemUI {
  product_id: number;
  productName: string;
  purchasedQty: number;
  quantity: number;
  unit_price: number;
  tax: number;
  discount: number;
}

export interface SupplierReturnItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  tax: number;
  discount: number;
  line_total: number;
  product: Product;
  created_at: string;
}

export interface SupplierReturnInvoiceDetail {
  id: number;
  invoice_number: string;
  invoice_date: string;
  subtotal: number;
  tax_total: number;
  discount_total: number;
  refund_total: number;
  refund_method: string;
  status: string;
  reason: string;
  notes: string | null;
  supplier: Supplier;
  original_purchase_invoice_id: number;
  items: SupplierReturnItem[];
  created_by: CreatedBy;
  created_at: string;
  updated_at: string;
}

export interface SupplierReturnDetailResponse {
  data: SupplierReturnInvoiceDetail;
}