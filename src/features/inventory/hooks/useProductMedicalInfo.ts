import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import type { ProductMedicalInfo, MedicalInfoFormValues } from "../types/MedicalInfo";

const MEDICAL_INFO_KEY = "product-medical-info";

export function useProductMedicalInfo(productId: number, enabled: boolean = true) {
  return useQuery({
    queryKey: [MEDICAL_INFO_KEY, productId],
    queryFn: async () => {
      const { data } = await api.get<{ data: ProductMedicalInfo | null }>(
        `/products/${productId}/medical-info`
      );
      return data.data;
    },
    enabled: !!productId && enabled,
  });
}

export function useUpsertMedicalInfo(productId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: MedicalInfoFormValues) => {
      const { data } = await api.put<{ data: ProductMedicalInfo }>(
        `/products/${productId}/medical-info`,
        payload
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MEDICAL_INFO_KEY, productId] });
      toast.success("medical_info.toast.save_success");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message;
      toast.error(message || "medical_info.toast.save_error");
    },
  });
}

export function useDeleteMedicalInfo(productId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete<{ message: string }>(
        `/products/${productId}/medical-info`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MEDICAL_INFO_KEY, productId] });
      toast.success("medical_info.toast.delete_success");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message;
      toast.error(message || "medical_info.toast.delete_error");
    },
  });
}