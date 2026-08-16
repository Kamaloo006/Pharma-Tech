import api from '@/lib/api';
import { type WeeklyRevenueResponse } from '../types/dashboard'; 
import { useQuery } from '@tanstack/react-query';

export const fetchWeeklyRevenue = async (): Promise<WeeklyRevenueResponse> => {
  const response = await api.get<WeeklyRevenueResponse>('/dashboard/weekly-revenue');
  return response.data;
};

export const useWeeklyRevenue = () => {
    return useQuery<WeeklyRevenueResponse>({
        queryKey: ['weekly-revenue'],
        queryFn: fetchWeeklyRevenue,
        staleTime: 5 * 60 * 1000, 
    });
}