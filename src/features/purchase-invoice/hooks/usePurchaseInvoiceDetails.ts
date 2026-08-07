import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type PurchaseInvoice } from "../types/purchase-invoice";
import api from "@/lib/api";

const fetchPurchaseInvoiceDetails = async (
  id: number | string
): Promise<PurchaseInvoice> => {
  const { data } = await api.get<{ data: PurchaseInvoice }>(
    `/purchase-invoices/${id}`
  );
  return data.data;
};


const cancelPurchaseInvoice = async (id: number | string): Promise<PurchaseInvoice> => {
  const { data } = await api.patch<{ data: PurchaseInvoice }>(
    `/purchase-invoices/${id}/cancel`
  );
  return data.data;
};

export function usePurchaseInvoiceDetails(id: number | string | undefined) {
  return useQuery({
    queryKey: ["purchaseInvoice", id],
    queryFn: () => fetchPurchaseInvoiceDetails(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}

export function useCancelPurchaseInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => cancelPurchaseInvoice(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["purchaseInvoice", id] });
      queryClient.invalidateQueries({ queryKey: ["purchaseInvoices"] });
    },
  });
}