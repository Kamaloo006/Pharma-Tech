import { useQuery } from "@tanstack/react-query";
import i18next from "i18next";
import {
  getGovernoratesWithCities,
  type GovernorateWithCities,
} from "@/utils/syriaLocations";

export function useGetCities() {
  return useQuery<GovernorateWithCities[]>({
    queryKey: ["governorates-with-cities", i18next.language],
    queryFn: async () => {
      return getGovernoratesWithCities(i18next.language);
    },
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
  });
}
