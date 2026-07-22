import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import api from "@/lib/api";
import type { ProductDetails } from "../types/Product";
import type { StockMovement } from "../types/StockMovement";
import type { Batch } from "../types/Batch";


export function useProductDetails(customProductId?: string | null) {
  const { id: paramId } = useParams<{ id: string }>();
  
  
  const productId = customProductId ?? paramId;

  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  
  const {
    data: ProductData,
    isLoading,
    error,
    refetch: refetchProduct,
  } = useQuery<ProductDetails, any>({
    queryKey: ["product-details", productId],
    queryFn: async () => {
      const { data } = await api.get(`/products/${productId}`);
      return data.data;
    },
    enabled: !!productId,
    retry: (failureCount, error) => {
      if (error?.response?.status === 404 || error?.response?.status === 403)
        return false;
      return failureCount < 2;
    },
  });

  const isProductLoaded = !!ProductData;

  
  const batchesQuery = useQuery<Batch[], any>({
    queryKey: ["product-batches", productId],
    queryFn: async () => {
      const { data } = await api.get(`/products/${productId}/batches/available`);
      return data.data;
    },
    
    enabled: isProductLoaded && !!productId,
  });

  
  const movementsQuery = useQuery<StockMovement[], any>({
    queryKey: ["product-movements", productId],
    queryFn: async () => {
      const { data } = await api.get(`/stock-movements?product_id=${productId}`);
      return data.data;
    },
    enabled: isProductLoaded && !!productId,
  });

  return {
    id: productId,
    product: ProductData,
    productLoading: isLoading,
    productError: error,
    refetchProduct,
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