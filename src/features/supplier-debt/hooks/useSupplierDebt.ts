import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type {
  SupplierDebtApiResponse,
  SingleSupplierDebtApiResponse,
  DebtsFilterParams,
  SupplierDebtDetailsData,
  PayDebtPayload,
} from "@/features/supplier-debt/types/SupplierDebt";

const fetchSupplierDebts = async (
  filters: DebtsFilterParams = {}
): Promise<SupplierDebtApiResponse> => {
  const cleanParams: Record<string, any> = {};

  if (filters.supplier_id && filters.supplier_id !== "all") {
    cleanParams.supplier_id = filters.supplier_id;
  }
  if (filters.status && filters.status !== "all") {
    cleanParams.status = filters.status;
  }
  if (filters.page) {
    cleanParams.page = filters.page;
  }
  if (filters.per_page) {
    cleanParams.per_page = filters.per_page;
  }

  const { data } = await api.get<SupplierDebtApiResponse>("/supplier-debts", {
    params: cleanParams,
  });

  return data;
};


const fetchSupplierDebtById = async (
  id: string | number
): Promise<SupplierDebtDetailsData> => {
  const { data } = await api.get<SingleSupplierDebtApiResponse>(
    `/supplier-debts/${id}`
  );
  return data.data;
};


export function useSupplierDebt(filters: DebtsFilterParams = {}) {
  return useQuery({
    queryKey: ["supplierDebts", filters],
    queryFn: () => fetchSupplierDebts(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}


export function useSupplierDebtDetails(id: string | number | undefined) {
  return useQuery({
    queryKey: ["supplierDebt", id],
    queryFn: () => fetchSupplierDebtById(id!),
    enabled: !!id, 
    staleTime: 1000 * 60 * 5,
  });
}


const paySupplierDebt = async ({
  supplierDebtId,
  payload,
}: {
  supplierDebtId: string | number;
  payload: PayDebtPayload;
}) => {
  const { data } = await api.post(
    `/supplier-debts/${supplierDebtId}/pay`,
    payload
  );
  return data;
};


export function usePaySupplierDebt(supplierDebtId: string | number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PayDebtPayload) =>
      paySupplierDebt({ supplierDebtId, payload }),
    onSuccess: () => {
      
      queryClient.invalidateQueries({
        queryKey: ["supplierDebt", String(supplierDebtId)],
      });
      
      queryClient.invalidateQueries({
        queryKey: ["supplierDebts"],
      });
    },
  });
}