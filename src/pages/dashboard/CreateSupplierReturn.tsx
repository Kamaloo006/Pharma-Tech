import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useSuppliers } from "@/features/suppliers/hooks/useSuppliers";
import { usePurchaseInvoices } from "@/features/purchase-invoice/hooks/usePurchaseInvoices";
import { usePurchaseInvoiceDetails } from "@/features/purchase-invoice/hooks/usePurchaseInvoiceDetails";
import { useCreateSupplierReturn } from "@/features/supplier-return/hooks/useSupplierReturns";
import type { ReturnItemUI } from "@/features/supplier-return/types/SupplierReturn";

import { SupplierReturnHeader } from "@/features/supplier-return/components/create-supplier-return/SupplierReturnHeader";
import { SupplierReturnFormHeader } from "@/features/supplier-return/components/create-supplier-return/SupplierReturnFormHeader";
import { ReturnItemsTable } from "@/features/supplier-return/components/create-supplier-return/ReturnItemsTable";
import { ReturnSummaryForm } from "@/features/supplier-return/components/create-supplier-return/ReturnSummaryForm";
import type { PurchaseInvoice } from "@/features/purchase-invoice/types/purchase-invoice";

export default function CreateSupplierReturnPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";

  const [supplierId, setSupplierId] = useState<string>("");
  const [invoiceId, setInvoiceId] = useState<string>("");
  const [refundMethod, setRefundMethod] = useState<"cash" | "credit">("cash");
  const [reason, setReason] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [items, setItems] = useState<ReturnItemUI[]>([]);

  const { suppliers = [], isLoading: loadingSuppliers } = useSuppliers();

  const { data: invoicesData, isLoading: loadingInvoices } =
    usePurchaseInvoices(1, { supplier_id: supplierId });

  const { data: invoiceDetails, isLoading: loadingSingleInvoice } =
    usePurchaseInvoiceDetails(invoiceId || undefined);

  const createReturnMutation = useCreateSupplierReturn();

  const rawPurchaseInvoices = invoicesData?.data || [];
  const purchaseInvoices = rawPurchaseInvoices.map((inv: PurchaseInvoice) => ({
    ...inv,

    label: `${inv.invoice_number || inv.id} (${inv.grand_total ? inv.grand_total.toLocaleString() : 0} SYR)`,
  }));

  useEffect(() => {
    if (!invoiceId || !invoiceDetails) {
      if (!invoiceId) setItems([]);
      return;
    }

    const rawItems = (invoiceDetails as PurchaseInvoice).items || [];

    if (Array.isArray(rawItems) && rawItems.length > 0) {
      const formattedItems: ReturnItemUI[] = rawItems.map((item: any) => {
        const productId = item.product_id || item.product?.id || item.id;

        const productName = isArabic
          ? item.product?.brand_name ||
            item.product?.ar_name ||
            item.product?.name ||
            item.name
          : item.product?.ar_name ||
            item.product?.brand_name ||
            item.product?.name ||
            item.name;

        const purchasedQty = Number(item.quantity ?? item.pivot?.quantity ?? 0);

        let unitPrice = Number(
          item.wholesale_price ??
            item.product?.buying_price ??
            item.unit_price ??
            item.cost_price ??
            0,
        );

        const lineTotal = Number(
          item.line_total ?? item.subtotal ?? item.total ?? 0,
        );
        if (unitPrice === 0 && lineTotal > 0 && purchasedQty > 0) {
          unitPrice = lineTotal / purchasedQty;
        }

        return {
          product_id: Number(productId),
          productName:
            productName || t("common.unknownProduct", "Unknown Product"),
          purchasedQty: purchasedQty,
          quantity: 0,
          unit_price: unitPrice,
          tax: Number(item.tax ?? item.tax_amount ?? 0),
          discount: Number(item.discount ?? item.discount_amount ?? 0),
        };
      });

      setItems(formattedItems);
    } else {
      setItems([]);
    }
  }, [invoiceDetails, invoiceId, isArabic, t]);

  const handleSupplierChange = (val: string) => {
    setSupplierId(val);
    setInvoiceId("");
    setItems([]);
  };

  const handleInvoiceChange = (val: string) => {
    setInvoiceId(val);
  };

  const handleQuantityChange = (productId: number, newQty: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product_id === productId
          ? {
              ...item,
              quantity: Math.min(Math.max(0, newQty), item.purchasedQty),
            }
          : item,
      ),
    );
  };

  const handleRemoveItem = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.product_id !== productId));
  };

  const subtotal = items.reduce(
    (acc, item) => acc + item.quantity * item.unit_price,
    0,
  );
  const taxTotal = items.reduce((acc, item) => acc + (item.tax || 0), 0);
  const discountTotal = items.reduce(
    (acc, item) => acc + (item.discount || 0),
    0,
  );
  const refundTotal = subtotal + taxTotal - discountTotal;

  const formatCurrency = (amount: number) => `${amount.toLocaleString()} SYR`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!supplierId) {
      toast.error(
        t(
          "supplierReturn.create.errors.selectSupplier",
          "Please select a supplier",
        ),
      );
      return;
    }

    if (!invoiceId) {
      toast.error(
        t(
          "supplierReturn.create.errors.selectInvoice",
          "Please select an original purchase invoice",
        ),
      );
      return;
    }

    const returnableItems = items.filter((item) => item.quantity > 0);

    if (returnableItems.length === 0) {
      toast.error(
        t(
          "supplierReturn.create.errors.noQty",
          "Please specify at least one product quantity to return",
        ),
      );
      return;
    }

    const payload = {
      supplier_id: Number(supplierId),
      original_purchase_invoice_id: Number(invoiceId),
      invoice_date: new Date().toISOString().split("T")[0],
      refund_method: refundMethod,
      reason: reason || undefined,
      notes: notes || undefined,
      items: returnableItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tax: item.tax,
        discount: item.discount,
      })),
    };

    createReturnMutation.mutate(payload, {
      onSuccess: (response) => {
        toast.success(
          t(
            "supplierReturn.create.successToast",
            "Supplier return created successfully!",
          ),
        );
        const returnId = response?.data?.id;
        navigate(
          returnId
            ? `/dashboard/supplier-return/${returnId}`
            : "/dashboard/supplier-returns",
        );
      },
      onError: (error: any) => {
        const apiErrorMessage =
          error?.response?.data?.message ||
          t(
            "supplierReturn.create.errors.failed",
            "Failed to create supplier return.",
          );
        toast.error(apiErrorMessage);
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      dir={isArabic ? "rtl" : "ltr"}
      className="p-6 space-y-6 max-w-8xl mx-auto"
    >
      <SupplierReturnHeader isArabic={isArabic} />

      <SupplierReturnFormHeader
        supplierId={supplierId}
        invoiceId={invoiceId}
        suppliers={suppliers}
        purchaseInvoices={purchaseInvoices}
        loadingSuppliers={loadingSuppliers}
        loadingInvoices={loadingInvoices || loadingSingleInvoice}
        isPending={createReturnMutation.isPending}
        onSupplierChange={handleSupplierChange}
        onInvoiceChange={handleInvoiceChange}
      />

      <ReturnItemsTable
        items={items}
        isArabic={isArabic}
        isPending={createReturnMutation.isPending || loadingSingleInvoice}
        onQuantityChange={handleQuantityChange}
        onRemoveItem={handleRemoveItem}
        formatCurrency={formatCurrency}
      />

      <ReturnSummaryForm
        refundMethod={refundMethod}
        reason={reason}
        notes={notes}
        subtotal={subtotal}
        taxTotal={taxTotal}
        discountTotal={discountTotal}
        refundTotal={refundTotal}
        isPending={createReturnMutation.isPending}
        onRefundMethodChange={setRefundMethod}
        onReasonChange={setReason}
        onNotesChange={setNotes}
        formatCurrency={formatCurrency}
      />
    </form>
  );
}
