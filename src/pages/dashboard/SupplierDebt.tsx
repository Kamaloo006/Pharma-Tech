import { useCallback, useMemo, useState } from "react";
import { useSupplierDebt } from "@/features/supplier-debt/hooks/useSupplierDebt";
import { SupplierDebtTable } from "@/features/supplier-debt/components/SupplierDebtTable";
import { SupplierDebtFilters } from "@/features/supplier-debt/components/SupplierDebtFilters";
import { SupplierDebtPagination } from "@/features/supplier-debt/components/SupplierDebtPagination";
import type { DebtsFilterParams } from "@/features/supplier-debt/types/SupplierDebt";
import { SupplierDebtHeader } from "@/features/supplier-debt/components/SupplierDebtHeader";

export default function SupplierDebtPage() {
  const [filters, setFilters] = useState<DebtsFilterParams>({
    supplier_id: "all",
    status: "all",
    page: 1,
    per_page: 15,
  });

  const { data, isLoading, isError, isFetching, refetch } =
    useSupplierDebt(filters);

  const debts = data?.data ?? [];
  const meta = data?.meta;

  const totals = useMemo(() => {
    return debts.reduce(
      (acc, debt) => {
        acc.total += debt.total_amount || 0;
        acc.paid += debt.paid_amount || 0;
        acc.remaining += debt.remaining_amount || 0;
        return acc;
      },
      { total: 0, paid: 0, remaining: 0 },
    );
  }, [debts]);

  const formatCurrency = useCallback(
    (amt: number) => `${(amt || 0).toLocaleString()} ل.س`,
    [],
  );
  const formatDate = (d: string) => {
    if (!d) return "-";
    try {
      const date = new Date(d);
      if (isNaN(date.getTime())) return "-";
      return date.toLocaleDateString("ar-SY");
    } catch {
      return "-";
    }
  };

  return (
    <div className="space-y-6 max-w-8xl  px-6 mx-auto">
      <SupplierDebtHeader totals={totals} formatCurrency={formatCurrency} />

      <SupplierDebtFilters
        filters={filters}
        onApplyFilters={(newFilters) =>
          setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
        }
        onResetFilters={() =>
          setFilters({
            supplier_id: "all",
            status: "all",
            page: 1,
            per_page: 15,
          })
        }
        isLoading={isFetching}
      />

      <SupplierDebtTable
        isLoading={isLoading}
        isError={isError}
        debts={debts}
        showFilterLoading={isFetching && !isLoading}
        refetch={refetch}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
      />

      <SupplierDebtPagination
        meta={meta}
        onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
        onPerPageChange={(per_page) =>
          setFilters((prev) => ({ ...prev, per_page, page: 1 }))
        }
        isLoading={isFetching}
      />
    </div>
  );
}
