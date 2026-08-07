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