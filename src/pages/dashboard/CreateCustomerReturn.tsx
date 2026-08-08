import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useCustomers } from "@/features/customers/hooks/useCustomers";
import {
  useSalesInvoices,
  useSalesInvoice,
} from "@/features/sales-invoice/hooks/useSalesInvoices";
import { useCreateCustomerReturn } from "@/features/customer-return/hooks/useCustomerReturns";
import type { ReturnItemUI } from "@/features/customer-return/types/CustomerReturn";
import type {
  SalesInvoice,
  SalesInvoiceDetails,
  SalesInvoiceItem,
} from "@/features/sales-invoice/types/salesInvoice";

import { CustomerReturnHeader } from "@/features/customer-return/components/create-return/CustomerReturnHeader";
import { CustomerReturnFormHeader } from "@/features/customer-return/components/create-return/CustomerReturnFormHeader";
import { ReturnItemsTable } from "@/features/supplier-return/components/create-supplier-return/ReturnItemsTable";
import { ReturnSummaryForm } from "@/features/supplier-return/components/create-supplier-return/ReturnSummaryForm";

export default function CreateCustomerReturnPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";

  const [customerId, setCustomerId] = useState<string>("");
  const [invoiceId, setInvoiceId] = useState<string>("");
  const [refundMethod, setRefundMethod] = useState<"cash" | "credit">("cash");
  const [reason, setReason] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [items, setItems] = useState<ReturnItemUI[]>([]);

  const { data: customersResponse, isLoading: loadingCustomers } = useCustomers(
    {
      page: 1,
    },
  );

  const customers = customersResponse?.data || [];

  const salesInvoiceFilters = customerId
    ? { customer_id: customerId === "walk_in" ? "walk_in" : customerId }
    : undefined;

  const { data: invoicesData, isLoading: loadingInvoices } = useSalesInvoices({
    page: 1,
    ...salesInvoiceFilters,
  });

  const { data: invoiceDetails, isLoading: loadingSingleInvoice } =
    useSalesInvoice(String(invoiceId));

  const createReturnMutation = useCreateCustomerReturn();

  const rawSalesInvoices = invoicesData?.data || [];
  const salesInvoices = rawSalesInvoices.map((inv: SalesInvoice) => ({
    ...inv,
    label: `${inv.invoice_number || inv.id} (${inv.grand_total ? inv.grand_total.toLocaleString() : 0} ${t("common.syr", "SYR")})`,
  }));

  useEffect(() => {
    if (!invoiceId || !invoiceDetails) {
      if (!invoiceId) setItems([]);
      return;
    }

    const rawItems = (invoiceDetails as SalesInvoiceDetails).items || [];

    if (Array.isArray(rawItems) && rawItems.length > 0) {
      const formattedItems: ReturnItemUI[] = rawItems.map(
        (item: SalesInvoiceItem | any) => {
          const productId = item.product_id || item.product?.id || item.id;

          const productName = isArabic
            ? item.brand_name ||
              item.product?.ar_name ||
              item.product?.brand_name ||
              item.name
            : item.brand_name ||
              item.product?.brand_name ||
              item.product?.ar_name ||
              item.name;

          const purchasedQty = Number(item.quantity ?? 0);
          const unitPrice = Number(item.selling_price ?? item.unit_price ?? 0);

          return {
            product_id: Number(productId),
            productName:
              productName || t("common.unknownProduct", "Unknown Product"),
            purchasedQty: purchasedQty,
            quantity: 0,
            unit_price: unitPrice,
            tax: Number(item.tax ?? 0),
            discount: Number(item.discount ?? 0),
          };
        },
      );

      setItems(formattedItems);
    } else {
      setItems([]);
    }
  }, [invoiceDetails, invoiceId, isArabic, t]);

  const handleCustomerChange = (val: string) => {
    setCustomerId(val);
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

  const formatCurrency = (amount: number) =>
    `${amount.toLocaleString()} ${t("common.syr", "SYR")}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerId) {
      toast.error(
        t(
          "customerReturn.create.errors.selectCustomer",
          "Please select a customer",
        ),
      );
      return;
    }

    if (!invoiceId) {
      toast.error(
        t(
          "customerReturn.create.errors.selectInvoice",
          "Please select an original sales invoice",
        ),
      );
      return;
    }

    const returnableItems = items.filter((item) => item.quantity > 0);

    if (returnableItems.length === 0) {
      toast.error(
        t(
          "customerReturn.create.errors.noQty",
          "Please specify at least one product quantity to return",
        ),
      );
      return;
    }

    const payload = {
      customer_id: customerId === "walk_in" ? null : Number(customerId),
      original_sales_invoice_id: Number(invoiceId),
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
            "customerReturn.create.successToast",
            "Customer return created successfully!",
          ),
        );
        const returnId = response?.data?.id;
        navigate(
          returnId
            ? `/dashboard/customer-return/${returnId}`
            : "/dashboard/customer-return",
        );
      },
      onError: (error: any) => {
        const status = error?.response?.status;

        if (status === 422) {
          toast.error(
            t(
              "customerReturn.create.errors.cannotReturnUnits",
              "الكمية المطلوبة للإرجاع تتجاوز الكمية المتاحة لهذه الفاتورة.",
            ),
          );

          setTimeout(() => {
            navigate("/dashboard/customer-return");
          }, 1000);

          return;
        }

        toast.error(
          t(
            "customerReturn.create.errors.failed",
            "حدث خطأ أثناء إنشاء المرجوع. يرجى المحاولة لاحقاً.",
          ),
        );
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      dir={isArabic ? "rtl" : "ltr"}
      className="p-6 space-y-6 max-w-8xl mx-auto"
    >
      <CustomerReturnHeader isArabic={isArabic} />

      <CustomerReturnFormHeader
        customerId={customerId}
        invoiceId={invoiceId}
        customers={customers}
        salesInvoices={salesInvoices}
        loadingCustomers={loadingCustomers}
        loadingInvoices={loadingInvoices || loadingSingleInvoice}
        isPending={createReturnMutation.isPending}
        onCustomerChange={handleCustomerChange}
        onInvoiceChange={handleInvoiceChange}
        formatCurrency={formatCurrency}
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
