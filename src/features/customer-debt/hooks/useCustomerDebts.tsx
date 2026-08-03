import { useQuery, keepPreviousData } from "@tanstack/react-query";

import type {
  CustomerDebtsResponse,
  CustomerDebtsFilterParams,
} from "@/features/customer-debt/types/customerDebt";
import api from "@/lib/api";

export const useCustomerDebts = (filters?: CustomerDebtsFilterParams) => {
  return useQuery<CustomerDebtsResponse>({
    queryKey: ["customer-debts", filters],
    queryFn: async () => {
      const params: Record<string, any> = {};

      if (filters?.customer_id && filters.customer_id !== "all") {
        params.customer_id = filters.customer_id;
      }
      if (filters?.status && filters.status !== "all") {
        params.status = filters.status;
      }
      if (filters?.page) {
        params.page = filters.page;
      }
      if (filters?.per_page) {
        params.per_page = filters.per_page;
      }

      const response = await api.get<CustomerDebtsResponse>("/customer-debts", {
        params,
      });
      return response.data;
    },
    placeholderData: keepPreviousData,
  });
};
