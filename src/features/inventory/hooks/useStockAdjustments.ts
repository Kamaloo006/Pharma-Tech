import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type{ StockAdjustmentPayload } from "../types/Stock";
import type { Batch } from "../types/Batch";
import api from "@/lib/api"; 


export function useProductBatches(productId: number, enabled: boolean) {
  return useQuery<Batch[]>({
    queryKey: ["stock-batches", productId],
    queryFn: async () => {
      const response = await api.get(`/stock-batches`, {
        params: { product_id: productId, status: "active" },
      });
      return response.data.data ?? response.data;
    },
    enabled: enabled && !!productId,
  });
}


export function useCreateStockAdjustment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: StockAdjustmentPayload) => {
      const response = await api.post("/stock-adjustments", payload);
      return response.data;
    },
    onSuccess: (_, variables) => {
      
      const pId = String(variables.product_id);

      
      queryClient.invalidateQueries({
        queryKey: ["product-details", pId],
      });

      
      queryClient.invalidateQueries({
        queryKey: ["product-batches", pId],
      });
      queryClient.invalidateQueries({
        queryKey: ["stock-batches", variables.product_id],
      });

      
      queryClient.invalidateQueries({
        queryKey: ["product-movements", pId],
      });

      
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}