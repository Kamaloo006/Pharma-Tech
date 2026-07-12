
export interface StockMovement {
  id: number;
  movement_type: "purchase_in" | "sale_out" | "adjustment_in" | "adjustment_out" | "expiry_out";
  quantity_change: number;
  reference_type: string;
  reference_id: number;
  notes: string | null;
  created_at: string;
  created_by: { first_name: string; last_name: string };
  batch?: { batch_number: string } | null;
}