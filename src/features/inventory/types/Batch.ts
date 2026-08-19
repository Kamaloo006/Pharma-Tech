import type { Product } from "./Product";

export interface Batch {
  id: number;
  product_id: number;
  purchase_invoice_id: number | null;
  batch_number: string;
  expiry_date: string | null;
  purchase_price: number;
  selling_price: number;
  quantity_on_hand: number;
  received_at: string | null;
  status: "active" | "expired" | "inactive";
  product?:Product;
  updated_at:string;
  created_at: string;
}