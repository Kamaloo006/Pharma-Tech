import type { User } from "@/types/User";
import type { Batch } from "./Batch";
import type { Product } from "./Product";

export interface StockMovement {
  id: number;
  product_id: number;
  batch_id: number | null;
  movement_type: "purchase_in" | "sale_out" | "adjustment_in" | "adjustment_out" | "expiry_out";
  quantity_change: number;
  reference_type: string;
  reference_id: number;
  product?:Product | null;
  batch?:Batch | null;
  notes: string | null;
  created_at: string;
  created_by: User | null;
  
}