// hooks/useProductDetails.ts
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import api from "@/lib/api";
import type { Product, Batch } from "../types/Product"; 

interface ProductDetailsResponse extends Omit<Product, 'base_unit' | 'selling_unit'> {
  barcode: string;
  scientific_name: string | null;
  prescription_required: boolean;
  buying_price: number;
  tax_rate: number;
  discount_rate: number;
  max_stock: number | null;
  units_per_base: number;
  allow_partial_selling: boolean;
  base_unit: { id: number; name: string; type: string } | null;
  selling_unit: { id: number; name: string; type: string } | null;
}

export function useProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const productQuery = useQuery<ProductDetailsResponse>({
    queryKey: ["product-details", id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}`);
      return data.data;
    },
    enabled: !!id,
  });

  const batchesQuery = useQuery<Batch[]>({
    queryKey: ["product-batches", id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}/batches/available`);
      return data.data;
    },
    enabled: !!id,
  });

  const categoriesQuery = useQuery<any[]>({
    queryKey: ["modal-categories-details", id], 
    queryFn: async () => {
      const response = await api.get("/categories");
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    },
    enabled: isEditModalOpen,
  });

  const companiesQuery = useQuery<any[]>({
    queryKey: ["modal-companies-details", id],
    queryFn: async () => {
      const response = await api.get("/companies");
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    },
    enabled: isEditModalOpen,
  });

  const isLoading = productQuery.isLoading || batchesQuery.isLoading;
  const isError = productQuery.isError || !productQuery.data;

  const safeCategories = Array.isArray(categoriesQuery.data) ? categoriesQuery.data : [];
  const safeCompanies = Array.isArray(companiesQuery.data) ? companiesQuery.data : [];

  return {
    id,
    product: productQuery.data,
    batches: batchesQuery.data || [],
    categories: safeCategories, 
    companies: safeCompanies,   
    isLoading,
    isError,
    t,
    isArabic,
    isEditModalOpen,
    setIsEditModalOpen,
  };
}