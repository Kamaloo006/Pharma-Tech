import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const filterSchema = z.object({
  search: z.string().default(""),
  category_id: z.string().default("all"),
  company_id: z.string().default("all"),
  prescription_required: z.string().default("all"),
  stock_status: z.enum(["all", "available", "low", "out"]).default("all"),
  with_trashed: z.boolean().default(false),
  min_price: z.string().default(""),
  max_price: z.string().default(""),
  expiry_filter: z.string().default(""),
  stock_range: z.string().default(""),
  sort_by: z.string().default(""),
});

type InventoryFilterInput = z.input<typeof filterSchema>;
export type InventoryFilterValues = z.output<typeof filterSchema>;

export const useInventoryFilters = () => {
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  
  const [appliedMoreFilters, setAppliedMoreFilters] = useState({
    min_price: "",
    max_price: "",
    prescription_required: "all",
    expiry_filter: "",
    stock_range: "",
    sort_by: "",
  });

  const { register, watch, reset, getValues } = useForm<InventoryFilterInput, unknown, InventoryFilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: "",
      category_id: "all",
      company_id: "all",
      prescription_required: "all",
      stock_status: "all",
      with_trashed: false,
      min_price: "",
      max_price: "",
      expiry_filter: "",
      stock_range: "",
      sort_by: "",
    },
  });

  const searchValues = watch("search") ?? "";
  const selectedCategory = watch("category_id") ?? "all";
  const stockStatusFilter = watch("stock_status") ?? "all";
  const withTrashedFilter = watch("with_trashed") ?? false;
  const selectedCompany = watch("company_id") ?? "all";

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValues);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchValues]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedCompany, stockStatusFilter, withTrashedFilter]);

  const applyMoreFilters = () => {
    const values = getValues();
    setAppliedMoreFilters({
      min_price: values.min_price || "",
      max_price: values.max_price || "",
      prescription_required: values.prescription_required || "all",
      expiry_filter: values.expiry_filter || "",
      stock_range: values.stock_range || "",
      sort_by: values.sort_by || "",
    });
    setCurrentPage(1); 
  };

  const resetMoreFilters = () => {
    const currentValues = getValues();
    
    reset({
      ...currentValues,
      min_price: "",
      max_price: "",
      prescription_required: "all",
      expiry_filter: "",
      stock_range: "",
      sort_by: "",
    });

    setAppliedMoreFilters({
      min_price: "",
      max_price: "",
      prescription_required: "all",
      expiry_filter: "",
      stock_range: "",
      sort_by: "",
    });
    setCurrentPage(1);
  };

  return {
    register,
    debouncedSearch,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    selectedCategory,
    selectedCompany,
    stockStatusFilter,
    withTrashedFilter,
    
    appliedMoreFilters, 
    applyMoreFilters,
    resetMoreFilters,
  };
};