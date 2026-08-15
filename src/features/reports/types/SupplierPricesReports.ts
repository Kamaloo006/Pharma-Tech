export interface SupplierPurchase {
  supplier_id: number;
  supplier_name: string;
  invoice_number: string;
  invoice_date: string;
  batch_number: string;
  unit_cost: number;
  unit_selling_price: number;
  margin: number;
}

export interface SupplierProductReport {
  product_id: number;
  brand_name: string;
  ar_name: string;
  category: string;
  min_cost: number;
  max_cost: number;
  avg_cost: number;
  purchases: SupplierPurchase[];
}

export interface SupplierPricesReportData {
  date_from: string | null;
  date_to: string | null;
  products: SupplierProductReport[];
}

export interface SupplierPricesReportResponse {
  data: SupplierPricesReportData;
}

export interface SupplierPricesParams {
  date_from?: string;
  date_to?: string;
}