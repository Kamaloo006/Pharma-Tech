import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import api from "@/lib/api";
import type { ProductDetails } from "../types/Product";
import type { StockMovement } from "../types/StockMovement";
import type { Batch } from "../types/Batch";

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export function useProductDetails(customProductId?: string | null) {
  const { id: paramId } = useParams<{ id: string }>();
  const productId = customProductId ?? paramId;
  const queryClient = useQueryClient();

  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [batchPage, setBatchPage] = useState<number>(1);
  const [movementPage, setMovementPage] = useState<number>(1);

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

  const batchesQuery = useQuery<PaginatedResponse<Batch>, unknown>({
    queryKey: ["product-batches", productId, batchPage],
    queryFn: async () => {
      const { data } = await api.get(
        `/stock-batches?product_id=${productId}&page=${batchPage}&per_page=10`
      );
      return data;
    },
    enabled: isProductLoaded && !!productId,
  });

  const movementsQuery = useQuery<PaginatedResponse<StockMovement>, unknown>({
    queryKey: ["product-movements", productId, movementPage],
    queryFn: async () => {
      const { data } = await api.get(
        `/stock-movements?product_id=${productId}&page=${movementPage}&per_page=10`
      );
      return data;
    },
    enabled: isProductLoaded && !!productId,
  });

  
  const markBatchExpiredMutation = useMutation({
    mutationFn: async (batchId: number) => {
      const { data } = await api.patch(`/stock-batches/${batchId}/mark-expired`);
      return data;
    },
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ["product-batches", productId] });
      queryClient.invalidateQueries({ queryKey: ["product-movements", productId] });
      queryClient.invalidateQueries({ queryKey: ["product-details", productId] });
    },
  });

  return {
    id: productId,
    product: ProductData,
    productLoading: isLoading,
    productError: error,
    refetchProduct,

    batches: batchesQuery.data?.data || [],
    batchesMeta: batchesQuery.data?.meta,
    batchPage,
    setBatchPage,
    batchesLoading: batchesQuery.isLoading,
    batchesError: batchesQuery.isError,
    refetchBatches: batchesQuery.refetch,

    t,

    movements: movementsQuery.data?.data || [],
    movementsMeta: movementsQuery.data?.meta,
    movementPage,
    setMovementPage,
    movementsLoading: movementsQuery.isLoading,
    movementsError: movementsQuery.isError,
    refetchMovements: movementsQuery.refetch,

    
    markBatchExpired: markBatchExpiredMutation.mutateAsync,
    isMarkingExpired: markBatchExpiredMutation.isPending,

    isArabic,
    isEditModalOpen,
    setIsEditModalOpen,
  };
}