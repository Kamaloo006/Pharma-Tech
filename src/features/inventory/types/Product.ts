import z from "zod";

export interface Category {
  id: number;
  name: string;
  description: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}



export interface Product {
  id: number;
  brand_name: string;
  ar_name:string;
  selling_price: number;
  base_unit: { id: number; name: string; type: string }; 
  selling_unit?: { id: number; name: string; type: string }; 
  min_stock: number;
  prescription_required:boolean;
  strength:string;
  company:{
    id: number;
    name: string;
  }
  barcode: string;
  total_quantity: number;
  nearest_expiry: string | null; 
  stock_status: "available" | "low" | "out";
  stock_alert_severity: "none" | "low" | "medium" | "high";
  category?: {
    id: number;
    name: string;
    description: string;
  };
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface ProductFilters {
  search?: string;

  category_id?: string;

  company_id?: string;

  prescription_required?: string;

  stock_status?: "all" | "available" | "low" | "out";

  with_trashed?: boolean;

  min_price?: string;

  max_price?: string;

  expiry_filter?: string;

  stock_range?: string;

  sort_by?: string;

  page: number;

  per_page: number;
}



export interface ProductDetails {
  id: number;
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
  units_per_base: number;
  allow_partial_selling: boolean;
  nearest_expiry: string | null;
  shelf: string | null;
  base_unit: { id: number; name: string; type: string } | null;
  selling_unit: { id: number; name: string; type: string } | null;
  category: { id: number; name: string; description: string } | null;
  company: { id: number; name: string; address: string } | null;
  medical_info: {
    dosage?: string;
    contraindications?: string;
    pregnancy?: string;
    interactions?: string;
    side_effects?: string;
    storage?: string;
  } | null;
  created_at: string;
  updated_at: string;
}



export const addProductSchema = z.object({
  category_id: z.string().min(1, { message: "Category is required" }),
  barcode: z.string().min(1, { message: "Barcode is required" }).max(255),
  brand_name: z.string().min(1, { message: "Brand name is required" }).max(255),
  ar_name: z.string().min(1, { message: "Arabic name is required" }).max(255),
  scientific_name: z.string().max(255).optional().nullable(),
  
  company_id: z.coerce.number({
    message: "Company is required",
}),

  prescription_required: z.boolean().default(false),
  
  buying_price: z.coerce
    .number({ message: "Buying price must be a number" })
    .min(0, { message: "Buying price must be 0 or greater" }),
    
  selling_price: z.coerce
    .number({ message: "Selling price must be a number" })
    .min(0, { message: "Selling price must be 0 or greater" }),
    
  tax_rate: z.coerce.number().min(0).max(100).default(0),
  discount_rate: z.coerce.number().min(0).max(100).default(0),
  min_stock: z.coerce.number().int().min(0).default(10),
  strength: z.string().max(50).optional().nullable(), 
  base_unit_id: z.coerce.number().nullable().optional(),
  selling_unit_id: z.coerce.number().nullable().optional(),
  units_per_base: z.coerce.number().int().min(1).default(1),
  allow_partial_selling: z.boolean().default(false),
  image_path: z.string().max(255).optional().nullable(),
}).refine((data) => data.selling_price >= data.buying_price, {
    message: "Selling price must be greater than or equal to buying price",
    path: ["selling_price"], 
  });

export type AddProductInput = z.input<typeof addProductSchema>;   
export type AddProductOutput = z.output<typeof addProductSchema>; 