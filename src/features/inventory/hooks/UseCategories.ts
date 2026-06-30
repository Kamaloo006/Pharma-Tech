import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api"; 
import { type CategoriesResponse } from "../types/Category"; 

export const getCategories = async (): Promise<CategoriesResponse> => {
  const { data } = await api.get<CategoriesResponse>("/categories");
  return data;
};

export const useCategories = () => {
  return useQuery<CategoriesResponse, Error>({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 10,
  });
};