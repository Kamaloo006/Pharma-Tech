import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const filterSchema = z.object({
  search: z.string().default(""),
  category_id: z.string().default("all"),
  prescription_required: z.string().default("all"),
  stock_status: z.enum(["all", "available", "low", "out"]).default("all"), 
  with_trashed: z.boolean().default(false),
});

type InventoryFilterInput = z.input<typeof filterSchema>;
export type InventoryFilterValues = z.output<typeof filterSchema>;

export const useInventoryFilters = () => {
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  const { register, watch } = useForm<InventoryFilterInput, unknown, InventoryFilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: "",
      category_id: "all",
      prescription_required: "all",
      stock_status: "all",
      with_trashed: false,
    },
  });

  const searchValues = watch("search") ?? "";
  const selectedCategory = watch("category_id") ?? "all";
  const prescriptionFilter = watch("prescription_required") ?? "all";
const stockStatusFilter = watch("stock_status") ?? "all";
  const withTrashedFilter = watch("with_trashed") ?? false;

  // the first useEffect for the debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValues);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchValues]);

  // Reset pagination when any filter changes 
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, prescriptionFilter, stockStatusFilter, withTrashedFilter]);

  return {
    register,
    debouncedSearch,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    selectedCategory,
    prescriptionFilter,
    stockStatusFilter,
    withTrashedFilter,
  };
};