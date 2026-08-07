import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type {
  CustomerReturnApiResponse,
  CustomerReturnFilterParams,
} from "../types/CustomerReturn";

const fetchCustomerReturnInvoices = async (
  filters: CustomerReturnFilterParams = {}
): Promise<CustomerReturnApiResponse> => {
  const params: Record<string, any> = {};

  if (filters.customer_id && filters.customer_id !== "all") {
  params.customer_id = filters.customer_id === "walk_in" ? "null" : filters.customer_id;
}
  if (filters.original_sales_invoice_id) {
    params.original_sales_invoice_id = filters.original_sales_invoice_id;
  }
  if (filters.status && filters.status !== "all") {
    params.status = filters.status;
  }
  if (filters.date_from) {
    params.date_from = filters.date_from;
  }
  if (filters.date_to) {
    params.date_to = filters.date_to;
  }
  if (filters.per_page) {
    params.per_page = filters.per_page;
  }
  if (filters.page) {
    params.page = filters.page;
  }

  const { data } = await api.get<CustomerReturnApiResponse>(
    "/customer-return-invoices",
    { params }
  );

  return data;
};

export function useCustomerReturns(filters: CustomerReturnFilterParams = {}) {
  return useQuery({
    queryKey: ["customerReturnInvoices", filters],
    queryFn: () => fetchCustomerReturnInvoices(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });
}