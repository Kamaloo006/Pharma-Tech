export type AdjustmentType = "add" | "remove";


export interface ProductSummary {
  id: number;
  name: string;
}

export interface AddStockAdjustmentPayload {
  adjustment_type: "add";
  product_id: number;
  quantity: number;
  purchase_price?: number;
  selling_price?: number;
  batch_number?: string;
  expiry_date?: string;
  notes?: string;
}

export interface RemoveStockAdjustmentPayload {
  adjustment_type: "remove";
  product_id: number;
  batch_id: number;
  quantity: number;
  notes?: string;
}

export type StockAdjustmentPayload =
  | AddStockAdjustmentPayload
  | RemoveStockAdjustmentPayload;