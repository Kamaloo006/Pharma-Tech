import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProducts } from "@/features/inventory/hooks/UseProducts";
import { useProductDetails } from "@/features/inventory/hooks/useProductDetails";
import { useCashBox } from "@/features/cashbox/hooks/useCashbox";
import { useDebounce } from "@/hooks/useDebounce";
import type {
  InvoiceItem,
  CreatePurchaseInvoicePayload,
  PurchaseInvoice,
} from "@/features/purchase-invoice/types/purchase-invoice";
import type { Product } from "@/features/inventory/types/Product";
import type { ProductDetails } from "@/features/inventory/types/Product";
import api from "@/lib/api";

const createPurchaseInvoiceApi = async (
  payload: CreatePurchaseInvoicePayload
): Promise<PurchaseInvoice> => {
  const response = await api.post<{ data: PurchaseInvoice }>(
    "/purchase-invoices",
    payload
  );
  return response.data.data;
};

export function useCreatePurchaseInvoice() {
  const [isArabic] = useState<boolean>(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // 1. قراءة productId من URL
  const paramProductId = searchParams.get("productId");
  const initialProductAdded = useRef<boolean>(false);

  // جلب بيانات المنتج الممرر في URL تلقائياً
  const { product: initialProduct, productLoading: isLoadingInitialProduct } =
    useProductDetails(paramProductId);

  // Basic Form States
  const [supplierId, setSupplierId] = useState<string>("");
  const [invoiceDate, setInvoiceDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState<string>("");

  // Product Search State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [items, setItems] = useState<InvoiceItem[]>([]);

  // Search Debounce Logic
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const isDebouncing = searchQuery.trim() !== debouncedSearchQuery.trim();
  const activeSearchQuery =
    debouncedSearchQuery.trim().length >= 2 ? debouncedSearchQuery.trim() : "";

  // Products Search Query
  const { data: productsData, isLoading: isSearchingProducts } = useProducts(
    {
      search: activeSearchQuery,
      page: 1,
      per_page: 10,
    },
    activeSearchQuery.length >= 2
  );

  // CashBox Status
  const { cashBox, isLoading: isCheckingCashBox } = useCashBox();
  const isCashBoxConfigured = !isCheckingCashBox && !!cashBox;

  // Filtered Products List
  const filteredProducts = useMemo(() => {
    if (!activeSearchQuery || isDebouncing || isSearchingProducts) {
      return [];
    }
    return productsData?.data || [];
  }, [activeSearchQuery, isDebouncing, isSearchingProducts, productsData]);

  // Invoice Items Management (يقبل Product أو ProductDetails)
  const handleAddProduct = (product: Product | ProductDetails) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product_id === product.id
      );

      if (existingIndex > -1) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const newItem: InvoiceItem = {
          id: `row-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          product_id: product.id,
          brand_name: product.brand_name || product.ar_name,
          scientific_name: product.category?.name || "N/A",
          strength: product.strength || "",
          wholesale_price: product.buying_price || 0,
          selling_price: product.selling_price || 0,
          tax: 0,
          discount: 0,
          quantity: 1,
          batch_number: "",
          expiry_date: product.nearest_expiry || "",
        };
        return [...prev, newItem];
      }
    });

    setSearchQuery("");
  };

  // 2. إضافة المنتج الممرر عبر URL أوتوماتيكياً فور تحميل بياناته
  useEffect(() => {
    if (initialProduct && !initialProductAdded.current) {
      handleAddProduct(initialProduct);
      initialProductAdded.current = true;
    }
  }, [initialProduct]);

  const updateItemField = (
    rowId: string,
    field: keyof InvoiceItem,
    value: any
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === rowId) {
          let parsedValue = value;
          if (
            [
              "quantity",
              "wholesale_price",
              "tax",
              "discount",
              "selling_price",
            ].includes(field)
          ) {
            parsedValue = value === "" ? 0 : Number(value);
          }
          return { ...item, [field]: parsedValue };
        }
        return item;
      })
    );
  };

  const removeItem = (rowId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== rowId));
  };

  // Calculations (Totals)
  const totals = useMemo(() => {
    let subtotal = 0;
    let taxTotal = 0;
    let discountTotal = 0;

    items.forEach((item) => {
      const lineTotalRaw = item.quantity * item.wholesale_price;
      const lineDiscount = item.quantity * item.discount;
      const lineTax = ((lineTotalRaw - lineDiscount) * item.tax) / 100;

      subtotal += lineTotalRaw;
      discountTotal += lineDiscount;
      taxTotal += lineTax;
    });

    const grandTotal = subtotal - discountTotal + taxTotal;

    return {
      subtotal,
      taxTotal,
      discountTotal,
      grandTotal,
    };
  }, [items]);

  // Payment Logic State
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

  const paymentStatus = useMemo(() => {
    if (totals.grandTotal <= 0) return isArabic ? "غير مدفوع" : "Unpaid";
    if (amountPaid >= totals.grandTotal)
      return isArabic ? "مدفوع بالكامل" : "Paid";
    if (amountPaid > 0 && amountPaid < totals.grandTotal)
      return isArabic ? "مدفوع جزئياً" : "Partial";
    return isArabic ? "غير مدفوع" : "Unpaid";
  }, [amountPaid, totals.grandTotal, isArabic]);

  // Validations
  const duplicateBatchNumbers = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach((item) => {
      const batch = item.batch_number.trim().toUpperCase();
      if (batch) {
        counts[batch] = (counts[batch] || 0) + 1;
      }
    });
    return Object.keys(counts).filter((batch) => counts[batch] > 1);
  }, [items]);

  const hasDuplicateBatches = duplicateBatchNumbers.length > 0;
  const isItemsEmpty = items.length === 0;

  // React Query Mutation
  const createInvoiceMutation = useMutation({
    mutationFn: createPurchaseInvoiceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["cashbox"] });
      queryClient.invalidateQueries({ queryKey: ["purchase-invoices"] });

      alert(
        isArabic ? "تم إتمام وحفظ الفاتورة بنجاح" : "Invoice saved successfully"
      );
      navigate("/dashboard/purchase-invoices");
    },
    onError: (error: any) => {
      const errorMsg =
        error?.response?.data?.message ||
        (isArabic ? "حدث خطأ أثناء حفظ الفاتورة" : "Failed to save invoice");
      alert(errorMsg);
    },
  });

  const isSaveDisabled =
    isItemsEmpty ||
    isAmountPaidExceeded ||
    hasDuplicateBatches ||
    !supplierId ||
    (paymentMethod === "cash" && !cashBox) ||
    createInvoiceMutation.isPending;

  // Submit Handler
  const handleSaveInvoice = () => {
    if (!supplierId) {
      alert(isArabic ? "يرجى اختيار المورد أولاً" : "Please select a supplier");
      return;
    }
    if (items.length === 0) {
      alert(
        isArabic
          ? "يرجى إضافة منتج واحد على الأقل للفاتورة"
          : "Please add at least one product"
      );
      return;
    }

    const payload: CreatePurchaseInvoicePayload = {
      supplier_id: Number(supplierId),
      invoice_date: invoiceDate,
      payment_method: paymentMethod,
      amount_paid: Number(amountPaid),
      notes: notes.trim() || null,
      items: items.map((item) => ({
        product_id: Number(item.product_id),
        quantity: Number(item.quantity),
        wholesale_price: Number(item.wholesale_price),
        tax: Number(item.tax || 0),
        discount: Number(item.discount || 0),
        batch_number: item.batch_number.trim(),
        expiry_date: item.expiry_date,
      })),
    };

    createInvoiceMutation.mutate(payload);
  };

  return {
    isArabic,
    supplierId,
    setSupplierId,
    invoiceDate,
    setInvoiceDate,
    notes,
    setNotes,
    searchQuery,
    setSearchQuery,
    items,
    filteredProducts,
    isSearchingProducts,
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
    duplicateBatchNumbers,
    hasDuplicateBatches,
    isSaving: createInvoiceMutation.isPending,
    isSaveDisabled,
    handleSaveInvoice,
    navigateToCashbox: () => navigate("/dashboard/cashbox"),
  };
}