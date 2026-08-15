import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import type { SalesReportParams, SalesReportResponse } from '../types/SalesReports';



const fetchSalesReport = async (params: SalesReportParams): Promise<SalesReportResponse> => {
  const response = await api.get<SalesReportResponse>('/reports/sales', {
    params: {
      period: params.period,
      date_from: params.date_from,
      date_to: params.date_to,
    },
  });
  return response.data;
};


export class SalesReportKeys {
  static all = ['reports', 'sales'] as const;
  static list = (params: SalesReportParams) => [...SalesReportKeys.all, params] as const;
}


export const useSalesReports = (params: SalesReportParams) => {
  return useQuery({
    queryKey: SalesReportKeys.list(params),
    queryFn: () => fetchSalesReport(params),
    enabled: Boolean(params.period && params.date_from && params.date_to),
    staleTime: 5 * 60 * 1000, 
  });
};