// useAddProductModal.ts
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useCreateProduct, useUpdateProduct } from "../hooks/UseProducts"; 
import { type AddProductInput, addProductSchema, type Product } from "../types/Product";

interface UseAddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

export function useAddProductModal({ isOpen, onClose, productToEdit }: UseAddProductModalProps) {
  const isEditMode = !!productToEdit; 

  const { data: fullProduct, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["product-details", productToEdit?.id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${productToEdit?.id}`);
      return data.data; 
    },
    enabled: isOpen && isEditMode && !!productToEdit?.id, 
  });

  const { mutate: createProductMutate, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProductMutate, isPending: isUpdating } = useUpdateProduct();

  const isPending = isCreating || isUpdating || isLoadingDetails;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddProductInput>({
    resolver: zodResolver(addProductSchema),
  });

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && fullProduct) {
        reset({
          brand_name: fullProduct.brand_name || "",
          ar_name: fullProduct.ar_name || "", 
          scientific_name: fullProduct.scientific_name || "", 
          barcode: fullProduct.barcode || "", 
          category_id: fullProduct.category_id
            ? String(fullProduct.category_id)
            : fullProduct.category?.id
              ? String(fullProduct.category.id)
              : "",
          buying_price: Number(fullProduct.buying_price) || 0, 
          selling_price: Number(fullProduct.selling_price) || 0,
          min_stock: Number(fullProduct.min_stock) || 0,
          tax_rate: Number(fullProduct.tax_rate) || 0, 
          discount_rate: Number(fullProduct.discount_rate) || 0, 
          units_per_base: Number(fullProduct.units_per_base) || 1, 
          base_unit: fullProduct.base_unit?.id ? String(fullProduct.base_unit.id) : fullProduct.base_unit || "",
          selling_unit: fullProduct.selling_unit?.id ? String(fullProduct.selling_unit.id) : fullProduct.selling_unit || "",
          prescription_required: Boolean(Number(fullProduct.prescription_required)),
          allow_partial_selling: Boolean(Number(fullProduct.allow_partial_selling)),
        });
      } else if (!isEditMode) {
        reset({
          brand_name: "",
          ar_name: "", 
          scientific_name: "",
          barcode: "",
          category_id: "",
          buying_price: 0,
          selling_price: 0,
          min_stock: 10,
          base_unit: "",
          selling_unit: "",
          units_per_base: 1,
          tax_rate: 0,
          discount_rate: 0,
          prescription_required: false,
          allow_partial_selling: false,
        });
      }
    }
  }, [isOpen, isEditMode, fullProduct, reset]);

  const onSubmit = (data: AddProductInput) => {
    const sanitizedData = {
      ...data,
      ar_name: data.ar_name === "" ? "" : data.ar_name, 
      scientific_name: data.scientific_name === "" ? null : data.scientific_name,
      base_unit: data.base_unit === "" ? null : data.base_unit,
      selling_unit: data.selling_unit === "" ? null : data.selling_unit,
    };

    if (isEditMode) {
      updateProductMutate(
        { id: productToEdit?.id, payload: sanitizedData  }, 
        {
          onSuccess: () => {
            reset();
            onClose();
          },
          onError: (err: any) => {
            alert(err?.response?.data?.message || "Error updating product");
          },
        }
      );
    } else {
      createProductMutate(sanitizedData as AddProductInput, {
        onSuccess: () => {
          reset();
          onClose();
        },
        onError: (err: any) => {
          alert(err?.response?.data?.message || "Error creating product");
        },
      });
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isEditMode,
    isPending,
    isLoadingDetails,
  };
}