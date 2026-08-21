import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProducts } from "@/features/inventory/hooks/UseProducts";
import { useProductDetails } from "@/features/inventory/hooks/useProductDetails";
import { CASH_BOX_QUERY_KEYS, useCashBox } from "@/features/cashbox/hooks/useCashbox";
import { useDebounce } from "@/hooks/useDebounce";
import type { Product, ProductDetails } from "@/features/inventory/types/Product";
import api from "@/lib/api";
import { toast } from "sonner";
import i18n from "@/utils/i18n";
import type { CreateSalesInvoicePayload, SalesInvoiceItem } from "../types/salesInvoice";
import { useTranslation } from "react-i18next";

const createSalesInvoiceApi = async (payload: CreateSalesInvoicePayload) => {
  const response = await api.post("/sales-invoices", payload);
  return response.data;
};

export function useCreateSalesInvoice() {
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  
  const paramProductId = searchParams.get("productId");
  const initialProductAdded = useRef<boolean>(false);

  const {t} = useTranslation();

  const { product: initialProduct, productLoading: isLoadingInitialProduct } =
    useProductDetails(paramProductId);

  
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [invoiceDate, setInvoiceDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState<string>("");

  
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [items, setItems] = useState<SalesInvoiceItem[]>([]);

  
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  
  
  const hasValidQuery = searchQuery.trim().length >= 2;
  const isDebouncing = searchQuery.trim() !== debouncedSearchQuery.trim();
  const activeSearchQuery = debouncedSearchQuery.trim();

  
  
  const { data: productsData, isLoading: isSearchingProducts, isFetching } = useProducts(
    {
      search: activeSearchQuery,
      page: 1,
      per_page: 10,
    },
    activeSearchQuery.length >= 2
  );

  
  const isLoadingProducts = hasValidQuery && (isDebouncing || isSearchingProducts || isFetching);

  
  const { cashBox, isLoading: isCheckingCashBox } = useCashBox();
  const isCashBoxConfigured = !isCheckingCashBox && !!cashBox;

  
  const filteredProducts = useMemo(() => {
    
    if (!activeSearchQuery || activeSearchQuery.length < 2 || isDebouncing) {
      return [];
    }
    return productsData?.data || [];
  }, [activeSearchQuery, isDebouncing, productsData]);

  
  const handleAddProduct = (product: Product | ProductDetails) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product_id === product.id
      );

      const scientificName =
        "scientific_name" in product
          ? product.scientific_name
          : product.category?.name || "N/A";

      const availableStock = product.total_quantity ?? 0;

      if (existingIndex > -1) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, availableStock),
              }
            : item
        );
      } else {
        const newItem: SalesInvoiceItem = {
          id: `row-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          product_id: product.id,
          brand_name: product.brand_name || product.ar_name,
          scientific_name: scientificName,
          strength: product.strength || "",
          selling_price: product.selling_price || 0,
          quantity: 1,
          tax: 0,
          discount: 0,
          stock: availableStock,
        };
        return [...prev, newItem];
      }
    });

    setSearchQuery("");
  };

  
  useEffect(() => {
    if (initialProduct && !initialProductAdded.current) {
      handleAddProduct(initialProduct);
      initialProductAdded.current = true;
    }
  }, [initialProduct]);

  const updateItemField = (
    rowId: string | number,
    field: keyof SalesInvoiceItem,
    value: any
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === rowId) {
          let parsedValue = value;
          if (
            ["quantity", "tax", "discount", "selling_price"].includes(field)
          ) {
            parsedValue = value === "" ? 0 : Number(value);
          }

          if (field === "quantity") {
            parsedValue = Math.max(1, Math.min(parsedValue, item.stock));
          }

          return { ...item, [field]: parsedValue };
        }
        return item;
      })
    );
  };

  const removeItem = (rowId: string | number) => {
    setItems((prev) => prev.filter((item) => item.id !== rowId));
  };

  
  const totals = useMemo(() => {
    let subtotal = 0;
    let taxTotal = 0;
    let discountTotal = 0;

    items.forEach((item) => {
      const lineTotalRaw = item.quantity * item.selling_price;
      const lineDiscount = item.discount;
      const lineTax = item.tax;

      subtotal += lineTotalRaw;
      discountTotal += lineDiscount;
      taxTotal += lineTax;
    });

    const grandTotal = Math.max(0, subtotal - discountTotal + taxTotal);

    return {
      subtotal,
      taxTotal,
      discountTotal,
      grandTotal,
    };
  }, [items]);

  
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "credit" | "debt"
  >("cash");
  const [amountPaid, setAmountPaid] = useState<number>(0);

  const isAmountPaidExceeded =
    amountPaid > totals.grandTotal && totals.grandTotal > 0;

  const remainingAmount = useMemo(() => {
    const diff = totals.grandTotal - amountPaid;
    return diff > 0 ? diff : 0;
  }, [totals.grandTotal, amountPaid]);

  useEffect(() => {
  if (paymentMethod === "cash" || paymentMethod === "credit") {
    setAmountPaid(totals.grandTotal);
  }
}, [paymentMethod, totals.grandTotal]);


  const paymentStatus = useMemo(() => {
    if (totals.grandTotal <= 0) return isArabic ? "غير مدفوع" : "Unpaid";
    if (amountPaid >= totals.grandTotal)
      return isArabic ? "مدفوع بالكامل" : "Paid";
    if (amountPaid > 0 && amountPaid < totals.grandTotal)
      return isArabic ? "مدفوع جزئياً" : "Partial";
    return isArabic ? "غير مدفوع" : "Unpaid";
  }, [amountPaid, totals.grandTotal, isArabic]);

  const isItemsEmpty = items.length === 0;

  
  const createInvoiceMutation = useMutation({
    mutationFn: createSalesInvoiceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: [CASH_BOX_QUERY_KEYS.all] });
      queryClient.invalidateQueries({
        queryKey: ["sales-invoices"],
        refetchType: "all",
      });
      
      toast.success(
        isArabic
          ? "تم إنشاء فاتورة المبيعات بنجاح"
          : "Sales invoice created successfully"
      );
      navigate("/dashboard/sales-invoice");
    },
    onError: (error: any) => {
      const errorMsg =
        error?.response?.data?.message ||
        (isArabic ? "حدث خطأ أثناء حفظ الفاتورة" : "Failed to save invoice");
        if(errorMsg == "A customer must be selected when the invoice is not fully paid.")
          toast.error(t("salesInvoice.errorMessage"));
          
    },
  });

 const isSaveDisabled =
  isItemsEmpty ||
  isAmountPaidExceeded ||
  (paymentMethod === "debt" && !customerId) ||
  ((paymentMethod === "cash" || amountPaid > 0) && !cashBox) ||
  createInvoiceMutation.isPending;

  
  const handleSaveInvoice = () => {
  if (paymentMethod === "debt" && !customerId) {
    toast.error(
      isArabic
        ? "يرجى اختيار زبون لتسجيل الدين عليه"
        : "Please select a customer for debt payment"
    );
    return;
  }

  if (items.length === 0) {
    toast.error(
      isArabic
        ? "يرجى إضافة منتج واحد على الأقل للفاتورة"
        : "Please add at least one product"
    );
    return;
  }

  const payload: CreateSalesInvoicePayload = {
    customer_id: customerId ? Number(customerId) : null,
    payment_method: paymentMethod,
    amount_paid: Number(amountPaid),
    invoice_date: invoiceDate,
    notes: notes.trim() || null,
    items: items.map((item) => ({
      product_id: Number(item.product_id),
      quantity: Number(item.quantity),
      selling_price: Number(item.selling_price),
      tax: Number(item.tax || 0),
      discount: Number(item.discount || 0),
    })),
  };

  createInvoiceMutation.mutate(payload);
};

  return {
    isArabic,
    customerId,
    setCustomerId,
    invoiceDate,
    setInvoiceDate,
    notes,
    setNotes,
    searchQuery,
    setSearchQuery,
    items,
    filteredProducts,
    isSearchingProducts: isLoadingProducts, 
    isDebouncing,
    isLoadingInitialProduct,
    handleAddProduct,
    updateItemField,
    removeItem,
    cashBox,
    isCheckingCashBox,
    isCashBoxConfigured,
    totals,
    paymentMethod,
    setPaymentMethod,
    amountPaid,
    setAmountPaid,
    isAmountPaidExceeded,
    remainingAmount,
    paymentStatus,
    isSaving: createInvoiceMutation.isPending,
    isSaveDisabled,
    handleSaveInvoice,
    navigateToCashbox: () => navigate("/dashboard/sales-invoice"),
  };
}