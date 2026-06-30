import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";  
import type { AddProductInput, ProductFilters, ProductsResponse } from "../types/Product";



export const getProducts = async (filters: ProductFilters): Promise<ProductsResponse> => {
  const params: Record<string, number | string> = {
    page: filters.page,
    per_page: filters.per_page,
  };

  if (filters.search) params.search = filters.search;
  if (filters.category_id && filters.category_id !== "all") params.category_id = filters.category_id;
  
  if (filters.prescription_required === "true") params.prescription_required = 1;
  if (filters.prescription_required === "false") params.prescription_required = 0;

  if (filters.stock_status && filters.stock_status !== "all") {
    params.stock_status = filters.stock_status; 
  }

  if (filters.with_trashed) params.with_trashed = 1;

  const { data } = await api.get<ProductsResponse>("/products", { params });
  console.log(data)
  return data;
};

export const useProducts = (filters: ProductFilters) => {
  return useQuery<ProductsResponse, Error>({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
    staleTime: 1000 * 30, 
    placeholderData: (previousData) => previousData, 
  });
};

export const usePrefetchProducts = () => {
  const queryClient = useQueryClient();
  return async (filters: ProductFilters) => {
    await queryClient.prefetchQuery({
      queryKey: ["products", filters],
      queryFn: () => getProducts(filters),
      staleTime: 1000 * 30,
    });
  };
};

export const createProduct = async (payload: AddProductInput) => {
  const { data } = await api.post("/products", payload);
  return data.data;
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const updateProduct = async ({ id, payload }: { id: number; payload: AddProductInput }) => {
  const { data } = await api.put(`/products/${id}`, payload);
  return data.data;
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};