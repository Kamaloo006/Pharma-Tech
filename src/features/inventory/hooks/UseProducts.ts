import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";  
import type { AddProductInput, ProductFilters, ProductsResponse } from "../types/Product";




export const getProducts = async (filters: ProductFilters): Promise<ProductsResponse> => {
  const params: Record<string, number | string> = {
    page: filters.page,
    per_page: filters.per_page,
  };

  console.log(filters)

  if (filters.search) params.search = filters.search;
  if (filters.category_id && filters.category_id !== "all") params.category_id = filters.category_id;
  
  if (filters.prescription_required === "true") params.prescription_required = 1;
  if (filters.prescription_required === "false") params.prescription_required = 0;

  if (filters.stock_status && filters.stock_status !== "all") {
    params.stock_status = filters.stock_status; 
  }
  

  if (filters.company_id && filters.company_id !== "all") {
    params.company_id = filters.company_id;
  }

  if (filters.with_trashed) params.with_trashed = 1;

  if (filters.min_price && filters.min_price !== "") params.min_price = filters.min_price;
  if (filters.max_price && filters.max_price !== "") params.max_price = filters.max_price;
  

  if (filters.expiry_filter && filters.expiry_filter !== "all") params.expiry_filter = filters.expiry_filter;
  if (filters.stock_range && filters.stock_range !== "all") params.stock_range = filters.stock_range;
  if (filters.sort_by && filters.sort_by !== "") params.sort_by = filters.sort_by;

  const { data } = await api.get<ProductsResponse>("/products", { params });
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
  console.log(payload);  
  const { data } = await api.put(`/products/${id}`, payload);
  
  return data.data;
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.invalidateQueries({
        queryKey: ["product-details", variables.id],
      });
    },
  });
};

export const deleteProduct = async (id: number) => {
  const response = await api.delete(`/products/${id}`);

  return response.data;
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
},

  });
};