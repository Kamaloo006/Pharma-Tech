import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type {
  CreateSupplierReturnPayload,
  SupplierReturnApiResponse,
  SupplierReturnDetailResponse,
  SupplierReturnFilterParams,
  SupplierReturnSingleApiResponse,
} from "@/features/supplier-return/types/SupplierReturn";
import { toast } from "sonner";

const fetchSupplierReturnInvoices = async (
  filters: SupplierReturnFilterParams = {}
): Promise<SupplierReturnApiResponse> => {
  const params: Record<string, any> = {};

  if (filters.supplier_id && filters.supplier_id !== "all") {
    params.supplier_id = filters.supplier_id;
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

  const { data } = await api.get<SupplierReturnApiResponse>(
    "/supplier-return-invoices",
    { params }
  );

  return data;
};

export function useSupplierReturns(filters: SupplierReturnFilterParams = {}) {
  return useQuery({
    queryKey: ["supplierReturnInvoices", filters],
    queryFn: () => fetchSupplierReturnInvoices(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });
}



const createSupplierReturn = async (
  payload: CreateSupplierReturnPayload
): Promise<SupplierReturnSingleApiResponse> => {
  const { data } = await api.post<SupplierReturnSingleApiResponse>(
    "/supplier-return-invoices",
    payload
  );
  return data;
};

export function useCreateSupplierReturn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSupplierReturn,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["purchaseInvoice", String(variables.original_purchase_invoice_id)],
      });
      queryClient.invalidateQueries({ queryKey: ["purchaseInvoices"] });
      queryClient.invalidateQueries({ queryKey: ["purchaseInvoice"] });
      queryClient.invalidateQueries({ queryKey: ["supplierReturns"] });
    },
  });
}


export const getSupplierReturnDetails = async (
  id: string | number
): Promise<SupplierReturnDetailResponse> => {
  const response = await api.get<SupplierReturnDetailResponse>(
    `supplier-return-invoices/${id}`
  );
  return response.data;
};


export function useSupplierReturnDetails(id: string | number | undefined) {
  return useQuery({
    queryKey: ["supplierReturnDetails", id],
    queryFn: () => getSupplierReturnDetails(id!),
    enabled: !!id, 
    staleTime: 1000 * 60 * 5, 
  });
}

export const cancelSupplierReturnInvoice = async (id: string | number) => {
  const response = await api.patch(
    `supplier-return-invoices/${id}/cancel`
  );
  return response.data;
};


export function useCancelSupplierReturn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => cancelSupplierReturnInvoice(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["supplierReturnDetails", String(id)],
      });
      queryClient.invalidateQueries({
        queryKey: ["supplierReturnInvoices"],
      });
      toast.success("Supplier return cancelled successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to cancel supplier return"
      );
    },
  });
}