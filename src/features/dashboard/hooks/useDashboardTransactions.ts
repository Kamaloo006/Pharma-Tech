import { useQuery, keepPreviousData } from '@tanstack/react-query';
import api from '@/lib/api';
import { type DashboardTransactionsResponse } from '../types/dashboard';

interface UseDashboardTransactionsOptions {
  page?: number;
  perPage?: number;
}

const fetchDashboardTransactions = async (page = 1, perPage = 15): Promise<DashboardTransactionsResponse> => {
  const response = await api.get<DashboardTransactionsResponse>('/dashboard/transactions', {
    params: {
      page,
      per_page: perPage,
    },
  });
  return response.data;
};

export const useDashboardTransactions = ({ page = 1, perPage = 15 }: UseDashboardTransactionsOptions = {}) => {
  return useQuery({
    queryKey: ['dashboard-transactions', page, perPage],
    queryFn: () => fetchDashboardTransactions(page, perPage),
    placeholderData: keepPreviousData, 
    staleTime: 1000 * 60 * 5, 
  });
};