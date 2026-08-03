import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Wallet,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { useCustomerDebts } from "@/features/customer-debt/hooks/useCustomerDebts";
import { useCustomers } from "@/features/customers/hooks/useCustomers";
import type { CustomerDebtsFilterParams } from "@/features/customer-debt/types/customerDebt";

import { DebtStatCard } from "@/features/customer-debt/components/DebtStatCard";
import { DebtFilters } from "@/features/customer-debt/components/DebtFilters";
import { DebtTable } from "@/features/customer-debt/components/DebtTable";
import { DebtPagination } from "@/features/customer-debt/components/DebtPagination";

export default function CustomerDebtPage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [filters, setFilters] = useState<CustomerDebtsFilterParams>({
    customer_id: "all",
    status: "all",
    page: 1,
    per_page: 15,
  });

  const [localFilters, setLocalFilters] = useState<CustomerDebtsFilterParams>({
    customer_id: "all",
    status: "all",
  });

  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useCustomerDebts(filters);
  const { data: customersData, isLoading: isLoadingCustomers } = useCustomers({
    per_page: 100,
  });

  const debtsList = useMemo(() => responseData?.data || [], [responseData]);
  const meta = responseData?.meta;

  const customersList = useMemo(() => {
    if (!customersData) return [];
    return Array.isArray(customersData)
      ? customersData
      : (customersData as any).data || [];
  }, [customersData]);

  const totals = useMemo(() => {
    return debtsList.reduce(
      (acc, debt) => {
        acc.total += debt.total_amount || 0;
        acc.paid += debt.paid_amount || 0;
        acc.remaining += debt.remaining_amount || 0;
        return acc;
      },
      { total: 0, paid: 0, remaining: 0 },
    );
  }, [debtsList]);

  const formatCurrency = useCallback(
    (amt: number) =>
      `${(amt || 0).toLocaleString()} ${t("common.currency", "ل.س")}`,
    [t],
  );

  const formatDate = (d?: string | null) => {
    if (!d) return "-";
    try {
      const date = new Date(d);
      if (isNaN(date.getTime())) return "-";
      return date.toLocaleDateString(isArabic ? "ar-SY" : "en-US");
    } catch {
      return "-";
    }
  };

  const handleApplyFilters = () => {
    setFilters((prev) => ({
      ...prev,
      ...localFilters,
      page: 1,
    }));
  };

  const handleResetFilters = () => {
    const resetValues: CustomerDebtsFilterParams = {
      customer_id: "all",
      status: "all",
    };
    setLocalFilters(resetValues);
    setFilters({
      ...resetValues,
      page: 1,
      per_page: 15,
    });
  };

  const handlePageChange = (newPage: number) => {
    if (meta && newPage >= 1 && newPage <= meta.last_page) {
      setFilters((prev) => ({ ...prev, page: newPage }));
    }
  };

  const cards = [
    {
      title: t("customerDebt.header.totalAmount"),
      value: totals.total,
      textColor: "text-foreground",
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      title: t("customerDebt.header.paidAmount"),
      value: totals.paid,
      textColor: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      icon: <CheckCircle2 className="h-5 w-5" />,
    },
    {
      title: t("customerDebt.header.remainingAmount"),
      value: totals.remaining,
      textColor: "text-destructive",
      bgColor: "bg-destructive/10",
      iconColor: "text-destructive",
      icon: <AlertCircle className="h-5 w-5" />,
    },
  ];

  return (
    <div
      className="space-y-6 max-w-8xl px-6 mx-auto"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* HEADER SECTION */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              {t("customerDebt.header.title")}
              <Wallet className="h-6 w-6 text-primary" />
              {isFetching && !isLoading && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ms-2" />
              )}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {t("customerDebt.header.description")}
            </p>
          </div>
        </div>

        {/* Header Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {cards.map((card, index) => (
            <DebtStatCard
              key={index}
              title={card.title}
              value={card.value}
              textColor={card.textColor}
              bgColor={card.bgColor}
              iconColor={card.iconColor}
              icon={card.icon}
              formatCurrency={formatCurrency}
            />
          ))}
        </div>
      </div>

      {/* FILTERS SECTION */}
      <DebtFilters
        localFilters={localFilters}
        setLocalFilters={setLocalFilters}
        customersList={customersList}
        isLoadingCustomers={isLoadingCustomers}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      {/* TABLE SECTION */}
      <DebtTable
        debtsList={debtsList}
        isLoading={isLoading}
        isArabic={isArabic}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />

      {/* PAGINATION SECTION */}
      {meta && (
        <DebtPagination
          meta={meta}
          isArabic={isArabic}
          onPageChange={handlePageChange}
          setFilters={setFilters}
        />
      )}
    </div>
  );
}
