import { useQuery } from "@tanstack/react-query";
import { type PurchaseInvoicesResponse } from "../types/purchase-invoice";
import api from "@/lib/api";


export interface InvoiceFilters {
  supplier_id?: string;
  status?: string;
  search?:string;
  payment_status?: string;
  from_date?: string;
  to_date?: string;
}

const fetchPurchaseInvoices = async (
  page: number = 1,
  filters: InvoiceFilters = {}
): Promise<PurchaseInvoicesResponse> => {
  const { data } = await api.get<PurchaseInvoicesResponse>("/purchase-invoices", {
    params: {
      page,
      ...filters,
    },
  });
  console.log(data);
  return data;
};

export function usePurchaseInvoices(page: number = 1, filters: InvoiceFilters = {}) {
  return useQuery({
    queryKey: ["purchaseInvoices", page, filters],
    queryFn: () => fetchPurchaseInvoices(page, filters),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 30,
  });
}