import type { ProductDetails } from "@/features/sales-invoice/types/salesInvoice";
import { z } from "zod";

// Customer Schema & Type
export const CustomerSchema = z.object({
  id: z.number(),
  full_name: z.string(),
  phone: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  deleted_at: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Customer = z.infer<typeof CustomerSchema>;

// CreatedBy Schema & Type
export const CreatedBySchema = z.object({
  id: z.number(),
  pharmacy_id: z.number(),
  first_name: z.string(),
  father_name: z.string().nullable().optional(),
  last_name: z.string(),
  email: z.string().email(),
  avatar: z.string().nullable().optional(),
  phone_number: z.string().nullable().optional(),
  status: z.string(),
  is_verified: z.boolean(),
  last_login_at: z.string().nullable().optional(),
  created_at: z.string(),
});

export type CreatedBy = z.infer<typeof CreatedBySchema>;

// Customer Return Invoice Schema
export const CustomerReturnInvoiceSchema = z.object({
  id: z.number(),
  invoice_number: z.string(),
  invoice_date: z.string(),
  subtotal: z.number(),
  tax_total: z.number(),
  discount_total: z.number(),
  refund_total: z.number(),
  refund_method: z.string(),
  status: z.enum(["completed", "approved", "pending", "cancelled"]),
  reason: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  customer: CustomerSchema.nullable().optional(),
  original_sales_invoice_id: z.number().nullable().optional(),
  created_by: CreatedBySchema,
  created_at: z.string(),
  updated_at: z.string(),
});

export type CustomerReturnInvoice = z.infer<typeof CustomerReturnInvoiceSchema>;


export interface ReturnItemUI {
  product_id: number;
  productName: string;
  purchasedQty: number;
  quantity: number;
  unit_price: number;
  tax: number;
  discount: number;
}

export interface CustomerReturnItemPayload {
  product_id: number;
  quantity: number;
  unit_price: number;
  tax: number;
  discount: number;
}

export interface CreateCustomerReturnPayload {
  customer_id: number | null; 
  original_sales_invoice_id: number;
  invoice_date?: string;
  refund_method: "cash" | "credit";
  reason?: string;
  notes?: string;
  items: CustomerReturnItemPayload[];
}

export interface CustomerReturnItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  tax: number;
  discount: number;
  line_total: number;
  product: ProductDetails ;
  created_at: string;
}

export interface CustomerReturnInvoiceDetail {
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
  customer: Customer | null;
  original_sales_invoice_id: number;
  items: CustomerReturnItem[];
  created_by: CreatedBy;
  created_at: string;
  updated_at: string;
}

export interface CustomerReturnSingleApiResponse {
  data: CustomerReturnInvoiceDetail;
}


// Filter Parameters Interface
export interface CustomerReturnFilterParams {
  status?: string;
  customer_id?: string;
  original_sales_invoice_id?: string;
  date_from?: string;
  date_to?: string;
  per_page?: number;
  page?: number;
}

// Pagination Meta & Links
export interface ApiPaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface ApiPaginationMetaLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface ApiPaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  links: ApiPaginationMetaLink[];
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

// Paginated API Response
export interface CustomerReturnApiResponse {
  data: CustomerReturnInvoice[];
  links: ApiPaginationLinks;
  meta: ApiPaginationMeta;
}