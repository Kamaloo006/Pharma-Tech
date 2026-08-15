export type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface SalesReportParams {
  period: ReportPeriod;
  date_from: string; 
  date_to: string;   
}

export interface SalesReportSummary {
  total_invoices: number;
  total_revenue: number;
  total_discount: number;
  total_tax: number;
  total_collected: number;
  total_outstanding: number;
  avg_invoice_value: number;
  units_sold: number;
}

export interface SalesReportBreakdownItem {
  period_label: string; 
  invoice_count: number;
  revenue: number;
  discount: number;
  tax: number;
  collected: number;
  outstanding: number;
}

export interface SalesReportData {
  period: ReportPeriod;
  date_from: string;
  date_to: string;
  summary: SalesReportSummary;
  breakdown: SalesReportBreakdownItem[];
}

export interface SalesReportResponse {
  data: SalesReportData;
}