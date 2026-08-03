import type { Customer } from "@/features/customers/types/Customer";

export type PaymentStatus = "paid" | "partial" | "unpaid";
export type PaymentMethod = "cash" | "card" | "debt" | string;
export type InvoiceStatus = "completed" | "pending" | "cancelled" | string;

export interface Creator {
  id: number;
  pharmacy_id?: number;
  first_name: string;
  father_name?: string | null;
  last_name: string;
  email: string;
  avatar?: string | null;
  phone_number: string;
  status?: string;
  is_verified?: boolean;
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

export interface Unit {
  id: number;
  name: string;
  type: string;
}

export interface Company {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
}

export interface ProductDetails {
  id: number | string;
  barcode: string;
  brand_name: string;
  scientific_name: string;
  ar_name: string;
  strength: string;
  prescription_required: boolean;
  buying_price: number;
  selling_price: number;
  total_quantity: number;
  tax_rate: number;
  discount_rate: number;
  min_stock: number;
  base_unit?: Unit;
  selling_unit?: Unit;
  company?: Company;
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

export interface SalesInvoiceDetails {
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
  items: SalesInvoiceItem[];
  customer_debt: unknown | null;
  created_by: Creator;
  created_at: string;
  updated_at: string;
}


export interface SalesInvoiceSingleResponse {
  data: SalesInvoiceDetails;
}


export interface CreateInvoiceFormItem {
  id: string; 
  product_id: number;
  brand_name: string;
  scientific_name: string;
  strength?: string;
  selling_price: number;
  quantity: number;
  tax: number;
  discount: number;
  stock: number;
}

export interface SalesInvoice {
  id: number | string;
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
  created_by: Creator;
  created_at: string;
  updated_at: string;
}

export interface SalesInvoicesApiResponse {
  data: SalesInvoice[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
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