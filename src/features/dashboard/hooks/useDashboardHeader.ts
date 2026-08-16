import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { HeaderResponse, HeaderData } from '../types/dashboard.ts';


const fetchDashboardHeader = async (): Promise<HeaderData> => {
  const response = await api.get<HeaderResponse>('/dashboard/header');
  return response.data.data;
};


export const dashboardKeys = {
  all: ['dashboard'] as const,
  header: () => [...dashboardKeys.all, 'header'] as const,
};


export const useDashboardHeader = () => {
  return useQuery({
    queryKey: dashboardKeys.header(),
    queryFn: fetchDashboardHeader,
    staleTime: 5 * 60 * 1000, 
  });
};