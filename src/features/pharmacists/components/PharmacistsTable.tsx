import { useTranslation } from "react-i18next";
import { Search, MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Pharmacist } from "@/features/pharmacists/types/Pharmacist";

interface PharmacistsTableProps {
  pharmacists: Pharmacist[];
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onEdit: (pharmacist: Pharmacist) => void;
  onDelete: (id: number) => void;
}

export function PharmacistsTable({
  pharmacists,
  isLoading,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
}: PharmacistsTableProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <Card className="border-border/60 shadow-xs bg-card rounded-2xl overflow-hidden">
      <CardHeader className="border-b border-border/40 bg-muted/20 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <span>{t("pharmacists.list_title")}</span>
          <Badge variant="secondary" className="rounded-full text-xs px-2.5">
            {pharmacists.length}
          </Badge>
        </CardTitle>

        <div className="relative w-full sm:w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto" />
          <Input
            placeholder={t("pharmacists.search_placeholder")}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="rtl:pr-9 ltr:pl-9 bg-background border-border/70 rounded-xl text-xs h-9"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/40">
              <TableHead className="text-start">
                {t("pharmacists.table.full_name")}
              </TableHead>
              <TableHead className="text-start">
                {t("pharmacists.table.email")}
              </TableHead>
              <TableHead className="text-start">
                {t("pharmacists.table.phone")}
              </TableHead>
              <TableHead className="text-start">
                {t("pharmacists.table.role")}
              </TableHead>
              <TableHead className="text-start">
                {t("pharmacists.table.created_at")}
              </TableHead>
              <TableHead className="w-16 text-center">
                {t("pharmacists.table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="size-6 animate-spin text-primary" />
                    <span className="text-xs">{t("pharmacists.loading")}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : pharmacists.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-muted-foreground text-xs"
                >
                  {t("pharmacists.empty")}
                </TableCell>
              </TableRow>
            ) : (
              pharmacists.map((pharmacist) => (
                <TableRow
                  key={pharmacist.id}
                  className="border-border/40 hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-medium text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {pharmacist.first_name[0]}
                      </div>
                      <span>
                        {pharmacist.first_name}{" "}
                        {pharmacist.father_name
                          ? `${pharmacist.father_name} `
                          : ""}
                        {pharmacist.last_name}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {pharmacist.email}
                  </TableCell>

                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {pharmacist.phone_number || "—"}
                  </TableCell>

                  <TableCell>
                    <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-[11px] font-normal px-2.5 py-0.5">
                      {t("pharmacists.role_badge")}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {pharmacist.created_at
                      ? new Date(pharmacist.created_at).toLocaleDateString(
                          isArabic ? "ar-EG" : "en-US",
                        )
                      : "—"}
                  </TableCell>

                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-lg"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="rounded-xl w-36 bg-muted"
                      >
                        <DropdownMenuItem
                          onClick={() => onEdit(pharmacist)}
                          className="gap-2 text-xs cursor-pointer text-blue-500 hover:text-foreground hover:bg-cyan-600/60 rounded-xl"
                        >
                          <Pencil className="size-3.5 " />
                          <span>{t("pharmacists.actions.edit")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            pharmacist.id && onDelete(pharmacist.id)
                          }
                          className="gap-2 text-xs text-rose-500 focus:text-white hover:bg-destructive cursor-pointer rounded-xl"
                        >
                          <Trash2 className="size-3.5" />
                          <span>{t("pharmacists.actions.delete")}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
