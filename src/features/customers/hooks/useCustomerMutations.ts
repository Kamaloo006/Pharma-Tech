import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type CustomerFormValues } from "../schemas/CustomerSchema";
import api from "@/lib/api";

export function useCustomerMutations() {
  const queryClient = useQueryClient();

  // 1. Create
  const createCustomerMutation = useMutation({
    mutationFn: async (data: CustomerFormValues) => {
      const response = await api.post("/customers", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });

  // 2. Edit
  const updateCustomerMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number | string;
      data: CustomerFormValues;
    }) => {
      const response = await api.put(`/customers/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });

  // 3. Delete (Soft Delete)
  const deleteCustomerMutation = useMutation({
    mutationFn: async (id: number | string) => {
      // إرسال طلب DELETE مباشر للـ Route: DELETE /customers/{customer}
      const response = await api.delete(`/customers/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });

  // 4. Restore
  const restoreCustomerMutation = useMutation({
    mutationFn: async (id: number | string) => {
      // الـ Route: Route::patch('customers/{customer}/restore', [CustomerController::class, 'restore'])->withTrashed();
      const response = await api.patch(`/customers/${id}/restore`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });

  return {
    createCustomer: createCustomerMutation,
    updateCustomer: updateCustomerMutation,
    deleteCustomer: deleteCustomerMutation,
    restoreCustomer: restoreCustomerMutation,
  };
}