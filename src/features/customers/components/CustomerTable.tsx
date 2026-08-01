import { useTranslation } from "react-i18next";
import {
  Users,
  MoreVertical,
  Pencil,
  Trash2,
  Phone,
  FileText,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { type Customer } from "@/features/customers/types/Customer";

interface CustomerTableProps {
  customers: Customer[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  showDeleted: boolean;
  page: number;
  meta?: {
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
  };
  onRefetch: () => void;
  onEdit: (customer: Customer) => void;
  onConfirmAction: (type: "delete" | "restore", customer: Customer) => void;
  onPageChange: (page: number | ((p: number) => number)) => void;
}

export function CustomerTable({
  customers,
  isLoading,
  isFetching,
  isError,
  showDeleted,
  page,
  meta,
  onRefetch,
  onEdit,
  onConfirmAction,
  onPageChange,
}: CustomerTableProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4 relative overflow-hidden">
      {isFetching && !isLoading && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/20 overflow-hidden">
          <div className="h-full bg-primary animate-pulse w-full" />
        </div>
      )}

      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Users className="w-4 h-4 text-primary" />
          {showDeleted
            ? t("customers.deletedListTitle", "قائمة الزبناء المحذوفين")
            : t("customers.listTitle", "Customer List")}
        </h2>
      </div>

      <div
        className={`overflow-x-auto transition-all duration-300 ease-in-out ${
          isFetching && !isLoading
            ? "opacity-50 pointer-events-none bg-muted/20 rounded-lg"
            : "opacity-100"
        }`}
      >
        <Table className="text-xs">
          <TableHeader className="bg-muted/30">
            <TableRow className="border-b border-border/60">
              <TableHead className={isArabic ? "text-right" : "text-left"}>
                {t("customers.table.customer", "Customer")}
              </TableHead>
              <TableHead className={isArabic ? "text-right" : "text-left"}>
                {t("customers.table.phone", "Phone")}
              </TableHead>
              <TableHead className={isArabic ? "text-right" : "text-left"}>
                {t("customers.table.notes", "Notes")}
              </TableHead>
              <TableHead className="text-center w-20">
                {t("customers.table.actions", "Actions")}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  <div className="flex justify-center items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    {t("common.loading", "Loading customers...")}
                  </div>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center gap-2 text-destructive text-xs">
                    <AlertCircle className="w-5 h-5" />
                    <span>
                      {t("customers.error", "Failed to load customers.")}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onRefetch}
                      className="mt-2 h-7 text-xs"
                    >
                      {t("common.retry", "Retry")}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : customers.length > 0 ? (
              customers.map((customer: Customer) => (
                <TableRow
                  key={customer.id}
                  className="border-b border-border/40 hover:bg-muted/10 transition-colors"
                >
                  <TableCell
                    className={`font-semibold text-foreground py-3 ${
                      isArabic ? "text-right" : "text-left"
                    }`}
                  >
                    {customer.full_name}
                  </TableCell>

                  <TableCell
                    className={`font-mono text-muted-foreground py-3 ${
                      isArabic ? "text-right" : "text-left"
                    }`}
                  >
                    {customer.phone ? (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-muted-foreground/70" />
                        <span>{customer.phone}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground/50">—</span>
                    )}
                  </TableCell>

                  <TableCell
                    className={`py-3 ${isArabic ? "text-right" : "text-left"}`}
                  >
                    {customer.notes ? (
                      <Badge
                        variant="outline"
                        className="bg-muted/40 font-normal text-xs gap-1 border-border/50 text-foreground"
                      >
                        <FileText className="w-3 h-3 text-muted-foreground" />
                        {customer.notes}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground/50">—</span>
                    )}
                  </TableCell>

                  <TableCell className="text-center py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-muted/80"
                        >
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align={isArabic ? "start" : "end"}
                        className="w-40 text-xs bg-muted"
                      >
                        {!showDeleted ? (
                          <>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.preventDefault();
                                onEdit(customer);
                              }}
                              className="gap-2 cursor-pointer hover:bg-primary/70"
                            >
                              <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                              {t("common.edit", "Edit")}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() =>
                                onConfirmAction("delete", customer)
                              }
                              className="gap-2 cursor-pointer font-medium hover:bg-red-500/70"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              {t("common.delete", "Delete")}
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                onConfirmAction("restore", customer)
                              }
                              className="gap-2 cursor-pointer text-emerald-600 dark:text-emerald-400 font-medium"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              {t("common.restore", "استعادة")}
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-muted-foreground text-xs"
                >
                  {showDeleted
                    ? t("customers.noDeletedResults", "لا يوجد زبناء محذوفون.")
                    : t("customers.noResults", "No customers found.")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-border/60 text-xs text-muted-foreground">
          <span>
            {t("common.showing", "Showing")} {meta.from || 0}{" "}
            {t("common.to", "to")} {meta.to || 0} {t("common.of", "of")}{" "}
            {meta.total}
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={page === 1}
              onClick={() => onPageChange((p) => Math.max(1, p - 1))}
            >
              {isArabic ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>

            <span className="font-mono text-foreground font-semibold">
              {meta.current_page} / {meta.last_page}
            </span>

            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={page === meta.last_page}
              onClick={() => onPageChange((p) => p + 1)}
            >
              {isArabic ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
