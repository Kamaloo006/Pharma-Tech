import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type {
  CreateCustomerReturnPayload,
  CustomerReturnApiResponse,
  CustomerReturnFilterParams,
  CustomerReturnInvoiceDetail,
  CustomerReturnSingleApiResponse,
} from "../types/CustomerReturn";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { sanitizeDateRange } from "@/utils/dateRange";



const fetchCustomerReturnInvoices = async (
  filters: CustomerReturnFilterParams = {}
): Promise<CustomerReturnApiResponse> => {
  const normalizedFilters = sanitizeDateRange(filters, "date_from", "date_to");
  const params: Record<string, any> = {};

  
  if (normalizedFilters.customer_id === "walk_in") {
    params.walk_in = 1;
  } else if (normalizedFilters.customer_id === "registered") {
    params.walk_in = 0;
  } else if (
    normalizedFilters.customer_id &&
    normalizedFilters.customer_id !== "all"
  ) {
    params.customer_id = normalizedFilters.customer_id;
  }

  
  if (normalizedFilters.walk_in !== undefined && !params.walk_in) {
    params.walk_in = normalizedFilters.walk_in ? 1 : 0;
  }

  if (normalizedFilters.original_sales_invoice_id) {
    params.original_sales_invoice_id = normalizedFilters.original_sales_invoice_id;
  }
  if (normalizedFilters.status && normalizedFilters.status !== "all") {
    params.status = normalizedFilters.status;
  }
  if (normalizedFilters.date_from) {
    params.date_from = normalizedFilters.date_from;
  }
  if (normalizedFilters.date_to) {
    params.date_to = normalizedFilters.date_to;
  }
  if (normalizedFilters.per_page) {
    params.per_page = normalizedFilters.per_page;
  }
  if (normalizedFilters.page) {
    params.page = normalizedFilters.page;
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

const createCustomerReturn = async (
  payload: CreateCustomerReturnPayload
): Promise<CustomerReturnSingleApiResponse> => {
  const { data } = await api.post<CustomerReturnSingleApiResponse>(
    "/customer-return-invoices",
    payload
  );
  return data;
};

export function useCreateCustomerReturn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomerReturn,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["salesInvoice", String(variables.original_sales_invoice_id)],
      });
      queryClient.invalidateQueries({ queryKey: ["salesInvoices"] });
      queryClient.invalidateQueries({ queryKey: ["salesInvoice"] });
      queryClient.invalidateQueries({ queryKey: ["customerReturns"] });
    },
  });
}

export const useCustomerReturnDetails = (id?: string) => {
  return useQuery({
    queryKey: ["customer-return-details", id],
    queryFn: async () => {
      if (!id) throw new Error("Invoice ID is required");
      const { data } = await api.get<{ data: CustomerReturnInvoiceDetail }>(
        `/customer-return-invoices/${id}`
      );
      return data;
    },
    enabled: !!id,
  });
};


export const useCancelCustomerReturn = () => {
  const queryClient = useQueryClient();
  const {t} = useTranslation();
  return useMutation({
    mutationFn: async (id: number | string) => {
      const { data } = await api.patch(
        `/customer-return-invoices/${id}/cancel`
      );
      return data;
    },
    onSuccess: (_, id) => {
      toast.info(t("customerReturn.details.cancelledSuccessfully"));
      
      queryClient.invalidateQueries({ queryKey: ["customer-return-details", String(id)] });
      queryClient.invalidateQueries({ queryKey: ["customer-returns"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "فشل في إلغاء فاتورة المرتجع";
      toast.error(errorMessage);
    },
  });
};