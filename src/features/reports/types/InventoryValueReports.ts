
export interface InventorySummary {
  total_cost_value: number;
  total_selling_value: number;
  total_potential_profit: number;
  overall_margin: number;
}

export interface InventoryProduct {
  product_id: number;
  brand_name: string;
  ar_name: string;
  category: string;
  total_quantity: number;
  cost_value: number;
  selling_value: number;
  potential_profit: number;
}

export interface InventoryValueResponse {
  data: {
    summary: InventorySummary;
    products: InventoryProduct[];
  };
}