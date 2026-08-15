import { useQuery } from "@tanstack/react-query";

import type { ProfitReportResponse, ProfitReportParams } from "../types/ProfitReports";
import api from "@/lib/api";

const fetchProfitReport = async (params: ProfitReportParams): Promise<ProfitReportResponse> => {
  const response = await api.get<ProfitReportResponse>("/reports/profit", {
    params,
  });
  return response.data;
};

export function useProfitReport(params: ProfitReportParams) {
  return useQuery({
    queryKey: ["profit-report", params.date_from, params.date_to],
    queryFn: () => fetchProfitReport(params),
    enabled: Boolean(params.date_from && params.date_to),
  });
}