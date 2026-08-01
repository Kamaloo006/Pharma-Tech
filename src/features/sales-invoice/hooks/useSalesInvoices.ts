import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { SalesInvoiceFilters, SalesInvoicesApiResponse } from "@/features/sales-invoice/types/salesInvoice";

export function useSalesInvoices(filters: SalesInvoiceFilters = {}) {
  const {
    page = 1,
    per_page = 15,
    status,
    payment_status,
    payment_method,
    customer_id,
    date_from,
    date_to,
  } = filters;

  return useQuery({
    queryKey: [
      "sales-invoices",
      { page, per_page, status, payment_status, payment_method, customer_id, date_from, date_to },
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
          date_from: date_from || undefined,
          date_to: date_to || undefined,
        },
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}