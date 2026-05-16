import { useQuery } from "@tanstack/react-query";
import * as authApi from "@/services/api/auth";

interface City {
  id: number | string;
  name: string;
}

export function useGetCities() {
  return useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const citiesList = await authApi.getCities();
      // Handle both array response and object with data property
      const citiesArray = Array.isArray(citiesList)
        ? citiesList
        : citiesList?.data || [];
      return citiesArray as City[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
  });
}
