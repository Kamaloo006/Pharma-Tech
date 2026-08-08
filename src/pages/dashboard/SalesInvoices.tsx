import { useState } from "react";
import { useSalesInvoices } from "@/features/sales-invoice/hooks/useSalesInvoices";
import type { SalesInvoiceFilters } from "@/features/sales-invoice/types/salesInvoice";
import { useCustomers } from "@/features/customers/hooks/useCustomers";
import type { Customer } from "@/features/customers/types/Customer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  ChevronsLeft,
  ChevronsRight,
  RotateCcw,
  Filter,
  Loader2,
  BadgeDollarSign,
  Eye,
  UserX,
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const initialFilters: SalesInvoiceFilters = {
  page: 1,
  per_page: 15,
  payment_status: "all",
  payment_method: "all",
  customer_id: "all",
  walk_in: undefined,
  date_from: "",
  date_to: "",
};

export default function SalesInvoicesPage() {
  const [appliedFilters, setAppliedFilters] =
    useState<SalesInvoiceFilters>(initialFilters);

  const [draftFilters, setDraftFilters] =
    useState<SalesInvoiceFilters>(initialFilters);

  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const { data: customersData, isLoading: isLoadingCustomers } = useCustomers({
    page: 1,
    per_page: 100,
  });
  const customers = customersData?.data || [];

  const { data, isLoading, isFetching, isError } = useSalesInvoices({
    ...appliedFilters,
    payment_status:
      appliedFilters.payment_status === "all"
        ? undefined
        : appliedFilters.payment_status,
    payment_method:
      appliedFilters.payment_method === "all"
        ? undefined
        : appliedFilters.payment_method,
    customer_id:
      appliedFilters.customer_id === "all" ||
      appliedFilters.customer_id === "walk_in" ||
      appliedFilters.customer_id === "registered"
        ? undefined
        : appliedFilters.customer_id,
    walk_in:
      appliedFilters.customer_id === "walk_in"
        ? 1
        : appliedFilters.customer_id === "registered"
          ? 0
          : undefined,
  });

  const handleDraftChange = (key: keyof SalesInvoiceFilters, value: any) => {
    setDraftFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAppliedFilters({ ...draftFilters, page: 1 });
  };

  const handleResetFilters = () => {
    setDraftFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (data?.meta && newPage > data.meta.last_page)) return;
    setAppliedFilters((prev) => ({ ...prev, page: newPage }));
    setDraftFilters((prev) => ({ ...prev, page: newPage }));
  };

  const isFiltersChanged =
    JSON.stringify(draftFilters) !== JSON.stringify(appliedFilters);

  const hasActiveFilters =
    JSON.stringify(appliedFilters) !== JSON.stringify(initialFilters);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 border-emerald-500/30">
            {t("salesInvoice.status.paid")}
          </Badge>
        );
      case "partial":
        return (
          <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25 border-amber-500/30">
            {t("salesInvoice.status.partial")}
          </Badge>
        );
      case "unpaid":
        return (
          <Badge variant="destructive">{t("salesInvoice.status.unpaid")}</Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const currentPage = data?.meta?.current_page || appliedFilters.page || 1;
  const lastPage = data?.meta?.last_page || 1;

  return (
    <div className="px-6 space-y-6 text-start">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight flex gap-2 items-center">
          {t("salesInvoice.title")} <BadgeDollarSign className="text-primary" />
        </h1>
        <Link to="/dashboard/sales-invoice/new">
          <Button>{t("salesInvoice.createInvoice")}</Button>
        </Link>
      </div>

      <Card className="border-border/60 shadow-xs overflow-hidden">
        <form onSubmit={handleApplyFilters}>
          <div className="p-4 bg-muted/20 border-b border-border/60 space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2 self-end md:self-auto ms-auto">
                {hasActiveFilters && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResetFilters}
                    disabled={isFetching}
                    className="h-9 px-3 text-xs font-bold text-destructive hover:bg-destructive/5 gap-1.5 rounded-xl transition-all"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>{t("salesInvoice.filters.reset")}</span>
                  </Button>
                )}

                <Button
                  type="submit"
                  disabled={!isFiltersChanged || isFetching}
                  className="h-9 px-4 text-xs font-bold gap-1.5 shadow-sm rounded-xl transition-all"
                >
                  {isFetching ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Filter className="h-3.5 w-3.5" />
                  )}
                  <span>{t("salesInvoice.filters.apply")}</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-1">
              {/* Customer Select Filter */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground">
                  {t("salesInvoice.filters.customer", "Customer")}
                </span>
                <Select
                  value={String(draftFilters.customer_id || "all")}
                  onValueChange={(val) => handleDraftChange("customer_id", val)}
                  disabled={isLoadingCustomers}
                >
                  <SelectTrigger className="h-9 w-full rounded-xl border border-input bg-muted hover:bg-secondary/80 text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary">
                    <SelectValue
                      placeholder={
                        isLoadingCustomers
                          ? t("common.loading", "Loading...")
                          : t(
                              "salesInvoice.filters.allCustomers",
                              "All Customers",
                            )
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-muted text-popover-foreground border-border shadow-md max-h-60">
                    <SelectItem
                      value="all"
                      className="text-xs font-semibold cursor-pointer hover:bg-primary/70"
                    >
                      {t("salesInvoice.filters.allCustomers", "All Customers")}
                    </SelectItem>

                    {/* Walk-in Customer Filter */}
                    <SelectItem
                      value="walk_in"
                      className="text-xs font-semibold cursor-pointer  hover:bg-primary/70"
                    >
                      <div className="flex items-center gap-1.5">
                        <UserX className="w-3.5 h-3.5" />
                        {t("salesInvoice.filters.walkIn", "Walk-in Customer")}
                      </div>
                    </SelectItem>

                    {/* All Registered Customers Filter */}

                    {/* Specific Customers List */}
                    {customers.map((c: Customer) => (
                      <SelectItem
                        key={c.id}
                        value={String(c.id)}
                        className="text-xs font-semibold cursor-pointer hover:bg-primary/70"
                      >
                        {c.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Status Select Filter */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground">
                  {t("salesInvoice.filters.paymentStatus")}
                </span>
                <Select
                  value={draftFilters.payment_status || "all"}
                  onValueChange={(val) =>
                    handleDraftChange("payment_status", val)
                  }
                >
                  <SelectTrigger className="h-9 w-full rounded-xl border border-input bg-muted hover:bg-secondary/80 text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary">
                    <SelectValue
                      placeholder={t("salesInvoice.filters.allStatuses")}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-muted border-border shadow-md">
                    <SelectItem
                      value="all"
                      className="text-xs font-semibold cursor-pointer hover:bg-primary/70"
                    >
                      {t("salesInvoice.filters.allStatuses")}
                    </SelectItem>
                    <SelectItem
                      value="paid"
                      className="text-xs font-semibold cursor-pointer hover:bg-primary/70"
                    >
                      {t("salesInvoice.status.paid")}
                    </SelectItem>
                    <SelectItem
                      value="partial"
                      className="text-xs font-semibold cursor-pointer hover:bg-primary/70"
                    >
                      {t("salesInvoice.status.partial")}
                    </SelectItem>
                    <SelectItem
                      value="unpaid"
                      className="text-xs font-semibold cursor-pointer hover:bg-primary/70"
                    >
                      {t("salesInvoice.status.unpaid")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Method Select Filter */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground">
                  {t("salesInvoice.filters.paymentMethod")}
                </span>
                <Select
                  value={draftFilters.payment_method || "all"}
                  onValueChange={(val) =>
                    handleDraftChange("payment_method", val)
                  }
                >
                  <SelectTrigger className="h-9 w-full rounded-xl border border-input bg-muted hover:bg-secondary/80 text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary">
                    <SelectValue
                      placeholder={t("salesInvoice.filters.allMethods")}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-muted border-border shadow-md">
                    <SelectItem
                      value="all"
                      className="text-xs font-semibold cursor-pointer hover:bg-primary/70"
                    >
                      {t("salesInvoice.filters.allMethods")}
                    </SelectItem>
                    <SelectItem
                      value="cash"
                      className="text-xs font-semibold cursor-pointer hover:bg-primary/70"
                    >
                      {t("salesInvoice.method.cash")}
                    </SelectItem>
                    <SelectItem
                      value="card"
                      className="text-xs font-semibold cursor-pointer hover:bg-primary/70"
                    >
                      {t("salesInvoice.method.card")}
                    </SelectItem>
                    <SelectItem
                      value="debt"
                      className="text-xs font-semibold cursor-pointer hover:bg-primary/70"
                    >
                      {t("salesInvoice.method.debt")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* From Date Input */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground">
                  {t("salesInvoice.filters.fromDate")}
                </span>
                <Input
                  type="date"
                  value={draftFilters.date_from || ""}
                  onChange={(e) =>
                    handleDraftChange("date_from", e.target.value)
                  }
                  className="h-9 text-xs font-semibold rounded-xl bg-muted text-foreground border-input"
                />
              </div>

              {/* To Date Input */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground">
                  {t("salesInvoice.filters.toDate")}
                </span>
                <Input
                  type="date"
                  value={draftFilters.date_to || ""}
                  min={draftFilters.date_from || ""}
                  onChange={(e) => handleDraftChange("date_to", e.target.value)}
                  className="h-9 text-xs font-semibold rounded-xl bg-muted text-foreground border-input"
                />
              </div>
            </div>
          </div>
        </form>
      </Card>

      <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden relative">
        <div className="h-1 w-full bg-muted overflow-hidden relative">
          {isFetching && (
            <div className="h-full bg-primary animate-pulse transition-all duration-300 w-full origin-left" />
          )}
        </div>

        <CardContent
          className={`p-0 transition-opacity duration-200 ${
            isFetching ? "opacity-75" : "opacity-100"
          }`}
        >
          <Table className="text-xs">
            <TableHeader className="bg-muted/30">
              <TableRow className="border-b border-border/60">
                <TableHead
                  className={`font-bold py-3.5 ${
                    isArabic ? "text-right" : "text-left"
                  }`}
                >
                  {t("salesInvoice.table.invoiceNumber")}
                </TableHead>
                <TableHead
                  className={`font-bold py-3.5 ${
                    isArabic ? "text-right" : "text-left"
                  }`}
                >
                  {t("salesInvoice.table.date")}
                </TableHead>
                <TableHead
                  className={`font-bold py-3.5 ${
                    isArabic ? "text-right" : "text-left"
                  }`}
                >
                  {t("salesInvoice.table.customer")}
                </TableHead>
                <TableHead
                  className={`font-bold py-3.5 ${
                    isArabic ? "text-right" : "text-left"
                  }`}
                >
                  {t("salesInvoice.table.total")}
                </TableHead>
                <TableHead
                  className={`font-bold py-3.5 ${
                    isArabic ? "text-right" : "text-left"
                  }`}
                >
                  {t("salesInvoice.table.paid")}
                </TableHead>
                <TableHead
                  className={`font-bold py-3.5 ${
                    isArabic ? "text-right" : "text-left"
                  }`}
                >
                  {t("salesInvoice.table.due")}
                </TableHead>
                <TableHead
                  className={`font-bold py-3.5 ${
                    isArabic ? "text-right" : "text-left"
                  }`}
                >
                  {t("salesInvoice.table.method")}
                </TableHead>
                <TableHead
                  className={`font-bold py-3.5 ${
                    isArabic ? "text-right" : "text-left"
                  }`}
                >
                  {t("salesInvoice.table.status")}
                </TableHead>
                <TableHead className="font-bold py-3.5 text-center">
                  {t("salesInvoice.table.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12">
                    {t("salesInvoice.loading")}
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-12 text-destructive font-medium"
                  >
                    {t("salesInvoice.error")}
                  </TableCell>
                </TableRow>
              ) : data?.data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-12 text-muted-foreground font-medium"
                  >
                    {t("salesInvoice.noResults")}
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map((invoice) => (
                  <TableRow
                    key={invoice.id}
                    className="border-b border-border/40 hover:bg-muted/20 transition-colors"
                  >
                    <TableCell className="font-mono font-bold">
                      {invoice.invoice_number}
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground">
                      {format(new Date(invoice.invoice_date), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {invoice.customer
                        ? invoice.customer.full_name
                        : t("salesInvoice.walkInCustomer")}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {invoice.grand_total.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-emerald-600 dark:text-emerald-400 font-bold">
                      {invoice.amount_paid.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-destructive font-bold">
                      {invoice.amount_due.toLocaleString()}
                    </TableCell>
                    <TableCell className="capitalize text-muted-foreground">
                      {t(`salesInvoice.method.${invoice.payment_method}`, {
                        defaultValue: invoice.payment_method,
                      })}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(invoice.payment_status)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Link to={`/dashboard/sales-details/${invoice.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-muted"
                          title={t("salesInvoice.table.viewDetails")}
                        >
                          <Eye className="h-4 w-4 text-muted-foreground hover:text-primary" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {data?.meta && lastPage > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-border/60 bg-muted/10 text-xs">
              <span className="text-muted-foreground font-medium">
                {t("common.showing")} {data.meta.from} {t("common.to")}{" "}
                {data.meta.to} {t("common.of")} {data.meta.total}{" "}
                {t("salesInvoice.paginationResults")}
              </span>

              <Pagination className="w-auto m-0">
                <PaginationContent className="gap-1">
                  <PaginationItem>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-lg"
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1 || isFetching}
                      title={t("salesInvoice.firstPage")}
                    >
                      {isArabic ? (
                        <ChevronsRight className="h-4 w-4" />
                      ) : (
                        <ChevronsLeft className="h-4 w-4" />
                      )}
                    </Button>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      className={`h-8 rounded-lg ${
                        currentPage === 1 || isFetching
                          ? "pointer-events-none opacity-50"
                          : ""
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                    />
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      isActive
                      className="w-14 rounded-lg font-mono font-semibold"
                      onClick={(e) => e.preventDefault()}
                    >
                      {currentPage} / {lastPage}
                    </PaginationLink>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      className={`h-8 rounded-lg ${
                        currentPage === lastPage || isFetching
                          ? "pointer-events-none opacity-50"
                          : ""
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage + 1);
                      }}
                    />
                  </PaginationItem>

                  <PaginationItem>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-lg"
                      onClick={() => handlePageChange(lastPage)}
                      disabled={currentPage === lastPage || isFetching}
                      title={t("salesInvoice.lastPage")}
                    >
                      {isArabic ? (
                        <ChevronsLeft className="h-4 w-4" />
                      ) : (
                        <ChevronsRight className="h-4 w-4" />
                      )}
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
