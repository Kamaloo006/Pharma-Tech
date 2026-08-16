// @/features/dashboard/hooks/useDashboardCards.ts
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { DashboardCardsResponse } from "../types/dashboard";




export const useDashboardCards = () => {
  return useQuery<DashboardCardsResponse>({
    queryKey: ["dashboard-cards"],
    queryFn: async () => {
      const response = await api.get("/dashboard/cards");
      return response.data.data;
    },
  });
};