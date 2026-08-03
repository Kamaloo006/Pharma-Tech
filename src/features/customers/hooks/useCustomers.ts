import { useQuery } from "@tanstack/react-query";
import { type Customer, type GetCustomersParams, type PaginatedCustomersResponse } from "../types/Customer";
import api from "@/lib/api";

interface UseCustomersParams {
  page?: number;
  per_page?: number;
  search?: string;
  trashed?: boolean; 
}


export const getCustomers = async (
  params?: GetCustomersParams
): Promise<PaginatedCustomersResponse> => {
  const response = await api.get<PaginatedCustomersResponse>(
    "/customers",
    { params }
  );
  return response.data;
};



export function useCustomers({
  page = 1,
  per_page = 15,
  search = "",
  trashed = false,
}: UseCustomersParams) {
  return useQuery({
    queryKey: ["customers", { page, per_page, search, trashed }],
    queryFn: async () => {
      const response = await api.get("/customers", {
        params: {
          page,
          per_page,
          search: search || undefined,
          ...(trashed ? { trashed: "only", only_trashed: 1 } : {}),
        },
      });
      return response.data;
    },
    select: (data) => {
      if (!data?.data) return data;

      const filteredData = data.data.filter((customer: Customer) => {
        if (trashed) {
          return customer.deleted_at !== null;
        }
        return customer.deleted_at === null;
      });

      return {
        ...data,
        data: filteredData,
      };
    },
    staleTime: 5 * 60 * 1000,
    
  });
}

