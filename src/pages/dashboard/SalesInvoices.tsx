import { useState } from "react";
import { useSalesInvoices } from "@/features/sales-invoice/hooks/useSalesInvoices";
import type { SalesInvoiceFilters } from "@/features/sales-invoice/types/salesInvoice";
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
  Text,
  BadgeDollarSign,
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const initialFilters: SalesInvoiceFilters = {
  page: 1,
  per_page: 15,
  payment_status: "all",
  payment_method: "all",
  date_from: "",
  date_to: "",
};

export default function SalesInvoicesPage() {
  const [appliedFilters, setAppliedFilters] =
    useState<SalesInvoiceFilters>(initialFilters);

  const [draftFilters, setDraftFilters] =
    useState<SalesInvoiceFilters>(initialFilters);

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
            Paid
          </Badge>
        );
      case "partial":
        return (
          <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25 border-amber-500/30">
            Partial
          </Badge>
        );
      case "unpaid":
        return <Badge variant="destructive">Unpaid</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const currentPage = data?.meta?.current_page || appliedFilters.page || 1;
  const lastPage = data?.meta?.last_page || 1;

  return (
    <div className="p-6 space-y-6 text-start">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight flex gap-2 items-center">
          Sales Invoices <BadgeDollarSign className="text-primary" />
        </h1>
        <Link to="/dashboard/sales-invoice/new">
          <Button>Create Sales Invoice</Button>
        </Link>
      </div>

      <Card className="border-border/60 shadow-xs overflow-hidden">
        <form onSubmit={handleApplyFilters}>
          <div className="p-4 bg-muted/20 border-b border-border/60 space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2 self-end md:self-auto">
                {hasActiveFilters && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResetFilters}
                    disabled={isFetching}
                    className="h-9 px-3 text-xs font-bold text-destructive hover:bg-destructive/5 gap-1.5 rounded-xl transition-all"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset</span>
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
                  <span>Apply Filters</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground">
                  Payment Status
                </span>
                <Select
                  value={draftFilters.payment_status || "all"}
                  onValueChange={(val) =>
                    handleDraftChange("payment_status", val)
                  }
                >
                  <SelectTrigger className="h-9 w-full rounded-xl border border-input bg-muted hover:bg-secondary/80 text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border shadow-md">
                    <SelectItem
                      value="all"
                      className="text-xs font-semibold cursor-pointer"
                    >
                      All Statuses
                    </SelectItem>
                    <SelectItem
                      value="paid"
                      className="text-xs font-semibold cursor-pointer"
                    >
                      Paid
                    </SelectItem>
                    <SelectItem
                      value="partial"
                      className="text-xs font-semibold cursor-pointer"
                    >
                      Partial
                    </SelectItem>
                    <SelectItem
                      value="unpaid"
                      className="text-xs font-semibold cursor-pointer"
                    >
                      Unpaid
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground">
                  Payment Method
                </span>
                <Select
                  value={draftFilters.payment_method || "all"}
                  onValueChange={(val) =>
                    handleDraftChange("payment_method", val)
                  }
                >
                  <SelectTrigger className="h-9 w-full rounded-xl border border-input bg-muted hover:bg-secondary/80 text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary">
                    <SelectValue placeholder="All Methods" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border shadow-md">
                    <SelectItem
                      value="all"
                      className="text-xs font-semibold cursor-pointer"
                    >
                      All Methods
                    </SelectItem>
                    <SelectItem
                      value="cash"
                      className="text-xs font-semibold cursor-pointer"
                    >
                      Cash
                    </SelectItem>
                    <SelectItem
                      value="card"
                      className="text-xs font-semibold cursor-pointer"
                    >
                      Card
                    </SelectItem>
                    <SelectItem
                      value="debt"
                      className="text-xs font-semibold cursor-pointer"
                    >
                      Debt
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground">
                  From Date
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

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground">
                  To Date
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
          className={`p-0 transition-opacity duration-200 ${isFetching ? "opacity-75" : "opacity-100"}`}
        >
          <Table className="text-xs">
            <TableHeader className="bg-muted/30">
              <TableRow className="border-b border-border/60">
                <TableHead className="font-bold py-3.5">Invoice #</TableHead>
                <TableHead className="font-bold py-3.5">Date</TableHead>
                <TableHead className="font-bold py-3.5">Customer</TableHead>
                <TableHead className="text-right font-bold py-3.5">
                  Total
                </TableHead>
                <TableHead className="text-right font-bold py-3.5">
                  Paid
                </TableHead>
                <TableHead className="text-right font-bold py-3.5">
                  Due
                </TableHead>
                <TableHead className="font-bold py-3.5">Method</TableHead>
                <TableHead className="font-bold py-3.5">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    Loading invoices...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-12 text-destructive font-medium"
                  >
                    Failed to fetch invoices.
                  </TableCell>
                </TableRow>
              ) : data?.data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-12 text-muted-foreground font-medium"
                  >
                    No sales invoices found.
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
                        : "Walk-in Customer"}
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
                      {invoice.payment_method}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(invoice.payment_status)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {data?.meta && lastPage > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-border/60 bg-muted/10 text-xs">
              <span className="text-muted-foreground font-medium">
                Showing {data.meta.from} to {data.meta.to} of {data.meta.total}{" "}
                results
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
                      title="First Page"
                    >
                      <ChevronsLeft className="h-4 w-4" />
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
                      title="Last Page"
                    >
                      <ChevronsRight className="h-4 w-4" />
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
