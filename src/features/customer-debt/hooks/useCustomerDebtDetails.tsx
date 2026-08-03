import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  type CustomerDebtDetailItem,
  type CustomerDebtDetailsResponse,
  type PayCustomerDebtPayload,
} from "../types/customerDebt";

export const getCustomerDebtDetails = async (
  debtId: string | number,
): Promise<CustomerDebtDetailItem> => {
  const response = await api.get<CustomerDebtDetailsResponse>(
    `/customer-debts/${debtId}`,
  );
  return response.data.data;
};

export function useCustomerDebtDetails(debtId: string | number | undefined) {
  return useQuery({
    queryKey: ["customer-debt", debtId],
    queryFn: () => getCustomerDebtDetails(debtId!),
    enabled: !!debtId,
    staleTime: 5 * 60 * 1000,
  });
}

export const payCustomerDebt = async ({
  debtId,
  payload,
}: {
  debtId: string | number;
  payload: PayCustomerDebtPayload;
}): Promise<CustomerDebtDetailItem> => {
  const response = await api.post<{ data: CustomerDebtDetailItem }>(
    `/customer-debts/${debtId}/pay`,
    payload,
  );
  return response.data.data;
};

export function usePayCustomerDebt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: payCustomerDebt,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["customer-debt", String(variables.debtId)],
      });
      queryClient.invalidateQueries({
        queryKey: ["customer-debt", Number(variables.debtId)],
      });

      queryClient.invalidateQueries({
        queryKey: ["customer-debts"],
      });
    },
  });
}
