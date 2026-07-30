import { useState } from "react";
import {
  RotateCcw,
  Plus,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSupplierReturns } from "@/features/supplier-return/hooks/useSupplierReturns";
import type { SupplierReturnFilterParams } from "@/features/supplier-return/types/SupplierReturn";
import { SupplierReturnSummaryCards } from "@/features/supplier-return/components/SupplierReturnSummaryCards";
import { SupplierReturnFilters } from "@/features/supplier-return/components/SupplierReturnFilters";
import { SupplierReturnTable } from "@/features/supplier-return/components/SupplierReturnTable";

export default function SupplierReturnsPage() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState<SupplierReturnFilterParams>({
    status: "all",
    supplier_id: "all",
    date_from: "",
    date_to: "",
    per_page: 15,
    page: 1,
  });

  const { data, isLoading, isError, isFetching, refetch } =
    useSupplierReturns(filters);

  const handleFilterChange = (updated: Partial<SupplierReturnFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      status: "all",
      supplier_id: "all",
      date_from: "",
      date_to: "",
      per_page: 15,
      page: 1,
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} SYR`;
  };

  const meta = data?.meta;

  return (
    <div className="p-6 space-y-6 max-w-8xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            Supplier Returns
            <RotateCcw className="w-6 h-6 text-primary" />
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage product returns to suppliers, track refunds, and status
            updates.
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard/supplier-return/create")}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Return</span>
        </button>
      </div>

      {isError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            Failed to load supplier return invoices. Please check your
            connection or try again.
          </span>
        </div>
      )}

      {/* Summary Cards */}
      <SupplierReturnSummaryCards
        invoices={data?.data || []}
        totalRecords={data?.meta?.total || 0}
      />

      {/* Filters */}
      <SupplierReturnFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        isLoading={isFetching}
      />

      {/* Table & Pagination Wrapper */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-4">
        <SupplierReturnTable
          invoices={data?.data || []}
          isLoading={isLoading}
          isError={isError}
          showFilterLoading={isFetching && !isLoading}
          refetch={refetch}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
        />

        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-border/60 text-xs">
            <span className="text-muted-foreground font-mono">
              Page{" "}
              <strong className="text-foreground">{meta.current_page}</strong>{" "}
              of <strong className="text-foreground">{meta.last_page}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={meta.current_page <= 1 || isFetching}
                onClick={() =>
                  handleFilterChange({ page: meta.current_page - 1 })
                }
                className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 text-muted-foreground transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={meta.current_page >= meta.last_page || isFetching}
                onClick={() =>
                  handleFilterChange({ page: meta.current_page + 1 })
                }
                className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 text-muted-foreground transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
