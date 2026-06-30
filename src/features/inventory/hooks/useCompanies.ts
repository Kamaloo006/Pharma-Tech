import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Company {
  id: number;
  name: string;
}

const getCompanies = async (): Promise<Company[]> => {
  const { data } = await api.get("/companies");
  return data.data;
};

export const useCompanies = () =>
  useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
    staleTime: 1000 * 60 * 10,
  });