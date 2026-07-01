// useAddProductModal.ts
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useCreateProduct, useUpdateProduct } from "../hooks/UseProducts"; 
import { useUnits } from "../hooks/useUnits"; 
import { type AddProductInput, addProductSchema, type Product } from "../types/Product";

const PACKAGING_TO_UNITS_MAP: Record<string, string[]> = {
  "Ampoule": ["Dose", "Ml", "Piece"],
  "Vial": ["Dose", "Ml", "Mg", "Piece"],
  "Syringe": ["Dose", "Ml", "Piece"],
  "Bottle": ["Drop", "Ml", "Piece", "Application"],
  "Tube": ["Gram", "Mg", "Piece"],
  "Box": ["Tablet", "Capsule", "Strip", "Piece", "Pouch", "Sachet", "Bottle", "Tube", "Ampoule"],
  "Pack": ["Tablet", "Capsule", "Strip", "Piece", "Patch"],
  "Inhaler": ["Dose", "Spray", "Piece"],
  "Patch": ["Piece", "Application"],
  "Pouch": ["Gram", "Piece", "Dose"],
  "Sachet": ["Gram", "Mg", "Piece", "Dose"],
  "Can": ["Ml", "Gram", "Piece"],
};

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

  const { data: unitsData } = useUnits();

  const { mutate: createProductMutate, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProductMutate, isPending: isUpdating } = useUpdateProduct();

  const isPending = isCreating || isUpdating || isLoadingDetails;

  const {
    register,
    handleSubmit,
    reset,
    setValue, 
    control,  
    formState: { errors },
  } = useForm<AddProductInput>({
    resolver: zodResolver(addProductSchema),
  });

  const selectedBaseUnit = useWatch({
    control,
    name: "base_unit_id",
  });

  useEffect(() => {
    if (isOpen && selectedBaseUnit && !isEditMode) {
      setValue("selling_unit_id", "");
    }
  }, [selectedBaseUnit, setValue, isEditMode, isOpen]);

  const getFilteredSubUnits = () => {
    if (!unitsData?.subUnits) return [];
    if (!selectedBaseUnit) return unitsData.subUnits; 

    const selectedPackaging = unitsData?.packagingUnits.find(
      u => u.id === Number(selectedBaseUnit)
    );

    const allowedSubNames = PACKAGING_TO_UNITS_MAP[selectedPackaging?.name ?? ""] ?? [];
    const allAvailableUnits = [...unitsData.subUnits, ...unitsData.packagingUnits];

    return allAvailableUnits.filter(
      (u) => allowedSubNames.includes(u.name) && u.id !== Number(selectedBaseUnit)
    );
  };

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

          company_id: fullProduct.company_id
            ? String(fullProduct.company_id)
            : fullProduct.company?.id
              ? String(fullProduct.company.id)
              : "",

          buying_price: Number(fullProduct.buying_price) || 0, 
          selling_price: Number(fullProduct.selling_price) || 0,
          min_stock: Number(fullProduct.min_stock) || 0,
          tax_rate: Number(fullProduct.tax_rate) || 0, 
          discount_rate: Number(fullProduct.discount_rate) || 0, 
          units_per_base: Number(fullProduct.units_per_base) || 1, 
          
          base_unit_id: fullProduct.base_unit?.id ? String(fullProduct.base_unit.id) : "",
          selling_unit_id: fullProduct.selling_unit?.id ? String(fullProduct.selling_unit.id) : "",
          
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
          company_id: "",
          buying_price: 0,
          selling_price: 0,
          min_stock: 10,
          base_unit_id: "",
          selling_unit_id: "",
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
      base_unit_id: data.base_unit_id === "" || data.base_unit_id === null ? null : Number(data.base_unit_id),
      selling_unit_id: data.selling_unit_id === "" || data.selling_unit_id === null ? null : Number(data.selling_unit_id),
    };

    if (isEditMode) {
      updateProductMutate(
        { id: productToEdit?.id, payload: sanitizedData as any }, 
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
      createProductMutate(sanitizedData as any, {
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
    selectedBaseUnit,               
    filteredSubUnits: getFilteredSubUnits(), 
  };
}