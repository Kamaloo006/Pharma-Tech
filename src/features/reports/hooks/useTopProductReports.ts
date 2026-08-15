import { useQuery } from "@tanstack/react-query";
import type { TopProductsReportResponse, TopProductsQueryParams } from "../types/TopProducts";
import api from "@/lib/api";

const fetchTopProductReports = async (params?: TopProductsQueryParams): Promise<TopProductsReportResponse> => {
  const response = await api.get<TopProductsReportResponse>("reports/top-products", {
    params,
  });
  return response.data;
};

export const useTopProductReports = (params?: TopProductsQueryParams) => {
  return useQuery({
    queryKey: ["reports", "top-products", params],
    queryFn: () => fetchTopProductReports(params),
  });
};