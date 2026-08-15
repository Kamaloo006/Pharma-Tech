
import { useQuery } from "@tanstack/react-query";
import { type InventoryValueResponse } from "../types/InventoryValueReports";
import api from "@/lib/api";

const fetchInventoryValue = async (): Promise<InventoryValueResponse> => {
  const { data } = await api.get<InventoryValueResponse>("reports/inventory-value");
  return data;
};

export const useInventoryValue = () => {
  return useQuery({
    queryKey: ["reports", "inventory-value"],
    queryFn: fetchInventoryValue,
  });
};