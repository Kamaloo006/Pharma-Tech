import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type {
  StockHealthResponse,
  StockHealthParams,
} from "../types/StockHealthReports";

const fetchStockHealthReport = async (
  params?: StockHealthParams
): Promise<StockHealthResponse> => {
  const response = await api.get<StockHealthResponse>(
    "/reports/stock-health",
    { params }
  );
  return response.data;
};

export class StockHealthKeys {
  static all = ["reports", "stock-health"] as const;
  static list = (params?: StockHealthParams) =>
    [...StockHealthKeys.all, params] as const;
}

export const useStockHealthReport = (params?: StockHealthParams) => {
  return useQuery({
    queryKey: StockHealthKeys.list(params),
    queryFn: () => fetchStockHealthReport(params),
    staleTime: 5 * 60 * 1000,
  });
};