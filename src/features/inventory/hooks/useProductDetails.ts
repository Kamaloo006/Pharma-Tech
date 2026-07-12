
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import api from "@/lib/api";
import type {  ProductDetails } from "../types/Product";
import type { StockMovement } from "../types/StockMovement";
import type { Batch } from "../types/Batch";





export function useProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  
  const productQuery = useQuery<ProductDetails, any>({
    queryKey: ["product-details", id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}`);
      return data.data;
    },
    enabled: !!id,
    retry: (failureCount, error) => {
      
      if (error?.response?.status === 404 || error?.response?.status === 403) return false;
      return failureCount < 2;
    }
  });

  
  const isProductLoaded = !!productQuery.data;

  
  const batchesQuery = useQuery<Batch[], any>({
    queryKey: ["product-batches", id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}/batches/available`);
      return data.data;
    },
    enabled: isProductLoaded, 
  });

  
  const movementsQuery = useQuery<StockMovement[], any>({
    queryKey: ["product-movements", id],
    queryFn: async () => {
      const { data } = await api.get(`/stock-movements?product_id=${id}`);
      return data.data;
    },
    enabled: isProductLoaded, 
  });

  return {
    id,
    product: productQuery.data,
    productLoading: productQuery.isLoading,
    productError: productQuery.error,
    
    batches: batchesQuery.data || [],
    batchesLoading: batchesQuery.isLoading,
    batchesError: batchesQuery.isError,
    refetchBatches: batchesQuery.refetch,

    t,
    
    movements: movementsQuery.data || [],
    movementsLoading: movementsQuery.isLoading,
    movementsError: movementsQuery.isError,
    refetchMovements: movementsQuery.refetch,

    isArabic,
    isEditModalOpen,
    setIsEditModalOpen,
  };
}