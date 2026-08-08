import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { SalesInvoiceFilters, SalesInvoicesApiResponse, SalesInvoiceSingleResponse } from "@/features/sales-invoice/types/salesInvoice";

export function useSalesInvoices(filters: SalesInvoiceFilters = {}) {
  const {
    page = 1,
    per_page = 15,
    status,
    payment_status,
    payment_method,
    customer_id,
    walk_in,
    date_from,
    date_to,
  } = filters;

  return useQuery({
    queryKey: [
      "sales-invoices",
      { page, per_page, status, payment_status, payment_method, customer_id, walk_in, date_from, date_to },
    ],
    queryFn: async () => {
      const response = await api.get<SalesInvoicesApiResponse>("/sales-invoices", {
        params: {
          page,
          per_page,
          status: status || undefined,
          payment_status: payment_status || undefined,
          payment_method: payment_method || undefined,
          customer_id: customer_id || undefined,
          walk_in: walk_in !== undefined ? walk_in : undefined,
          date_from: date_from || undefined,
          date_to: date_to || undefined,
        },
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}


const fetchSalesInvoice = async (id: string | number) => {
  const response = await api.get<SalesInvoiceSingleResponse>(`/sales-invoices/${id}`);
  return response.data.data;
};

export function useSalesInvoice(id: string | number) {
  return useQuery({
    queryKey: ["sales-invoice", id],
    queryFn: () => fetchSalesInvoice(id),
    enabled: Boolean(id),
  });
}

export function useCancelSalesInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | number) => {
      const response = await api.patch<SalesInvoiceSingleResponse>(
        `/sales-invoices/${id}/cancel`
      );
      return response.data.data;
    },
    onSuccess: (updatedInvoice) => {
      
      queryClient.setQueryData(
        ["sales-invoice", String(updatedInvoice.id)],
        updatedInvoice
      );

      
      queryClient.invalidateQueries({ queryKey: ["sales-invoices"] });
    },
  });
}