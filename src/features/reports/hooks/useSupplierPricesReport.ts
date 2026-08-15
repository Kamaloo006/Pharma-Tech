import { useQuery } from "@tanstack/react-query";

import type{
  SupplierPricesParams,
  SupplierPricesReportResponse,
} from "../types/SupplierPricesReports";
import api from "@/lib/api";

export const useSupplierPricesReport = (params?: SupplierPricesParams) => {
  return useQuery<SupplierPricesReportResponse>({
    queryKey: ["reports", "supplier-prices", params],
    queryFn: async () => {
      const response = await api.get<SupplierPricesReportResponse>(
        "reports/supplier-prices",
        { params }
      );
      return response.data;
    },
  });
};