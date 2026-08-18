import { useQuery } from "@tanstack/react-query";
import type { WeatherPredictResponse } from "../types/WeatherPredict"; 
import api from "@/lib/api";

export const usePredictNeeds = (enabled: boolean) => {
  return useQuery<WeatherPredictResponse>({
    queryKey: ["inventory", "predict-needs"],
    queryFn: async () => {
      const response = await api.get("/inventory/predict-needs");
      return response.data;
    },
    enabled, 
    staleTime: 1000 * 60 * 15, 
  });
};