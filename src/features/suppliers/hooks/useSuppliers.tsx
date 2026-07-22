import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import api from "@/lib/api";
import type { SupplierFormData } from "../types/Supplier";

export function useSuppliers() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["suppliers", page, searchQuery],
    queryFn: async () => {
      try {
        const response = await api.get(`/suppliers`, {
          params: { page, search: searchQuery, with_trashed: 1 },
        });

        if (page === 1 && !searchQuery && response.data?.data) {
          localStorage.setItem(
            "cached_suppliers",
            JSON.stringify(response.data.data),
          );
        }

        return response.data;
      } catch (err) {
        const localData = localStorage.getItem("cached_suppliers");
        if (localData) {
          console.warn("Using offline cached suppliers due to network error.");
          return { data: JSON.parse(localData), meta: null };
        }
        throw err;
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (searchInput.trim() === "") {
      setPage(1);
      setSearchQuery("");
    }
  }, [searchInput]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPage(1);
    setSearchQuery(searchInput);
  };

  const createMutation = useMutation({
    mutationFn: async (newSupplier: SupplierFormData) => {
      const response = await api.post(`/suppliers`, newSupplier);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: SupplierFormData;
    }) => {
      const response = await api.put(`/suppliers/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/suppliers/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.patch(`/suppliers/${id}/restore`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });

  return {
    suppliers: data?.data ?? [],
    meta: data?.meta ?? null,
    isLoading,
    error,
    page,
    setPage,
    searchInput,
    setSearchInput,
    handleSearchSubmit,

    createSupplier: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateSupplier: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    deleteSupplier: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,

    restoreSupplier: restoreMutation.mutateAsync,
    isRestoring: restoreMutation.isPending,
  };
}
