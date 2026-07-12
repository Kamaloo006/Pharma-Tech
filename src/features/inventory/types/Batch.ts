export interface Batch {
  id: number;
  product_id: number;
  purchase_invoice_id: number;
  batch_number: string;
  expiry_date: string;
  purchase_price: number;
  selling_price: number;
  quantity_on_hand: number;
  received_at: string;
  status: "active" | "expired" | "inactive";
  created_at: string;
}