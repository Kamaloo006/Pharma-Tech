export interface Supplier {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string | null;
  notes: string | null;
  deleted_at: string | null;
  company_id?: number | null;
  company: { id: number; name: string } | null;
  created_at: string;
  updated_at: string;
}

export interface SupplierFormData {
  name: string;
  phone: string;
  email: string;
  address?: string | null;
  notes?: string | null;
  company_id?: number | null;
}