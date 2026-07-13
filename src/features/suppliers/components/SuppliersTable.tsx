// features/inventory/components/SuppliersTable.tsx
import { useTranslation } from "react-i18next";
import {
  MoreHorizontal,
  Edit3,
  Trash2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Supplier } from "../hooks/useSuppliers";

interface SuppliersTableProps {
  suppliers: Supplier[];
  isArabic: boolean;
  meta: any;
  onPageChange: (page: number) => void;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
  onEdit: (supplier: Supplier) => void;
}

export default function SuppliersTable({
  suppliers,
  isArabic,
  meta,
  onPageChange,
  onDelete,
  onRestore,
  onEdit,
}: SuppliersTableProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
      <div className="rounded-xl border border-border/50 overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="text-[10px] uppercase font-bold text-muted-foreground hover:bg-transparent border-b border-border/60">
              <TableHead className={isArabic ? "text-right" : "text-left"}>
                {t("suppliers.tableHeaders.name")}
              </TableHead>
              <TableHead className={isArabic ? "text-right" : "text-left"}>
                {t("suppliers.tableHeaders.company")}
              </TableHead>
              <TableHead className="text-center">
                {t("suppliers.tableHeaders.phone")}
              </TableHead>
              <TableHead className={isArabic ? "text-right" : "text-left"}>
                {t("suppliers.tableHeaders.email")}
              </TableHead>
              <TableHead className="text-center">
                {t("suppliers.tableHeaders.status")}
              </TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-xs">
            {suppliers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  {isArabic
                    ? "لا يوجد موردين مطابقين للبحث"
                    : "No matching suppliers found"}
                </TableCell>
              </TableRow>
            ) : (
              suppliers.map((supplier) => {
                const isActive = !supplier.deleted_at;

                return (
                  <TableRow
                    key={supplier.id}
                    className={`hover:bg-muted/30 transition-colors border-b border-border/40 last:border-0 ${!isActive && "opacity-70 bg-muted/10"}`}
                  >
                    <TableCell className="font-semibold text-foreground py-3.5">
                      {supplier.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-medium">
                      {supplier.company?.name ?? "—"}
                    </TableCell>
                    <TableCell className="text-center font-mono font-medium text-muted-foreground">
                      {supplier.phone}
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground/80">
                      {supplier.email}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg border text-[10px] font-bold tracking-wide inline-block ${
                          isActive
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        }`}
                      >
                        {isActive
                          ? t("suppliers.statusValues.active")
                          : t("suppliers.statusValues.deleted")}
                      </span>
                    </TableCell>

                    <TableCell className="text-center py-0">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align={isArabic ? "start" : "end"}
                          className="w-44 border border-border bg-card p-1 text-xs rounded-xl shadow-md"
                        >
                          {isActive ? (
                            <>
                              <DropdownMenuItem
                                onClick={() => onEdit(supplier)}
                                className="flex items-center gap-2 cursor-pointer py-2 px-3 rounded-lg focus:bg-muted/60"
                              >
                                <Edit3 className="h-3.5 w-3.5 text-blue-400" />
                                <span>{t("suppliers.actions.edit")}</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onDelete(supplier.id)}
                                className="flex items-center gap-2 cursor-pointer py-2 px-3 rounded-lg text-destructive focus:text-destructive focus:bg-destructive/10"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>{t("suppliers.actions.delete")}</span>
                              </DropdownMenuItem>
                            </>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => onRestore(supplier.id)}
                              className="flex items-center gap-2 cursor-pointer py-2 px-3 rounded-lg text-emerald-400 focus:text-emerald-400 focus:bg-emerald-500/10"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              <span>{t("suppliers.actions.restore")}</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {meta && (
        <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <div>
            <span>
              {t("suppliers.pagination.showing")}{" "}
              <span className="font-semibold text-foreground">
                {meta.from ?? 0}-{meta.to ?? 0}
              </span>{" "}
              {t("suppliers.pagination.of")}{" "}
              <span className="font-semibold text-foreground">
                {meta.total}
              </span>{" "}
              {t("suppliers.pagination.suppliers")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg border-border/60"
              disabled={meta.current_page === 1}
              onClick={() => onPageChange(meta.current_page - 1)}
            >
              {isArabic ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg border-border/60"
              disabled={meta.current_page === meta.last_page}
              onClick={() => onPageChange(meta.current_page + 1)}
            >
              {isArabic ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
