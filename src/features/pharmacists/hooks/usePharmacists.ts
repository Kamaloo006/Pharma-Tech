import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type{
  Pharmacist,
  PharmacistsResponse,
  CreatePharmacistResponse,
  PharmacistPayload,
} from "../types/Pharmacist";
import api from "@/lib/api";

export const PHARMACISTS_QUERY_KEY = ["pharmacists"];

const fetchPharmacists = async (): Promise<PharmacistsResponse> => {
  const { data } = await api.get("/pharmacists");
  return data;
};

const createPharmacist = async (
  payload: PharmacistPayload
): Promise<CreatePharmacistResponse> => {
  const { data } = await api.post("/pharmacists", payload);
  return data;
};

const updatePharmacist = async ({
  id,
  ...payload
}: PharmacistPayload & { id: number }): Promise<{ message: string; data: Pharmacist }> => {
  const { data } = await api.put(`/pharmacists/${id}`, payload);
  return data;
};

const deletePharmacist = async (id: number): Promise<{ message: string }> => {
  const { data } = await api.delete(`/pharmacists/${id}`);
  return data;
};

export const usePharmacists = () => {
  const queryClient = useQueryClient();

  const pharmacistsQuery = useQuery({
    queryKey: PHARMACISTS_QUERY_KEY,
    queryFn: fetchPharmacists,
    select: (response) => response.data,
  });

  const addPharmacistMutation = useMutation({
    mutationFn: createPharmacist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PHARMACISTS_QUERY_KEY });
    },
  });

  const updatePharmacistMutation = useMutation({
    mutationFn: updatePharmacist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PHARMACISTS_QUERY_KEY });
    },
  });

  const deletePharmacistMutation = useMutation({
    mutationFn: deletePharmacist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PHARMACISTS_QUERY_KEY });
    },
  });

  return {
    pharmacists: pharmacistsQuery.data || [],
    isLoading: pharmacistsQuery.isLoading,
    isError: pharmacistsQuery.isError,
    error: pharmacistsQuery.error,
    refetch: pharmacistsQuery.refetch,

    addPharmacist: addPharmacistMutation.mutateAsync,
    isAdding: addPharmacistMutation.isPending,

    updatePharmacist: updatePharmacistMutation.mutateAsync,
    isUpdating: updatePharmacistMutation.isPending,

    deletePharmacist: deletePharmacistMutation.mutateAsync,
    isDeleting: deletePharmacistMutation.isPending,
  };
};