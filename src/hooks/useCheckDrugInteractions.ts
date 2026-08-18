import { useMutation } from "@tanstack/react-query";
import type { DrugInteractionResponse, DrugInteractionRequest } from "../types/DrugInteractions"
import api from "@/lib/api";

export const useCheckDrugInteractions = () => {
  return useMutation<DrugInteractionResponse, Error, DrugInteractionRequest>({
    mutationFn: async (payload) => {
      const response = await api.post("/inventory/check-drug-interactions", payload);
      return response.data;
    },
  });
};