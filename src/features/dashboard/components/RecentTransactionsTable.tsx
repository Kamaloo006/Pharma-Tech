// features/dashboard/components/RecentTransactionsTable.tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Receipt, Clock, ShoppingBag, RotateCcw, Truck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDashboardTransactions } from "@/features/dashboard/hooks/useDashboardTransactions";
import type { TransactionItem } from "@/features/dashboard/types/dashboard";

export function RecentTransactionsTable() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>("all");

  const { data: transactionsData, isLoading: isTransactionsLoading } =
    useDashboardTransactions({ page: 1, perPage: 10 });

  const transactionsList = transactionsData?.data ?? [];
  const filteredTransactions = transactionsList.filter(
    (tx: TransactionItem) => {
      if (activeTab === "all") return true;
      if (activeTab === "sales") return tx.type === "sale";
      if (activeTab === "purchases") return tx.type === "purchase";
      if (activeTab === "customer-returns")
        return tx.type === "customer_return";
      if (activeTab === "supplier-returns")
        return tx.type === "supplier_return";
      return true;
    },
  );

  const renderTypeDetails = (type: string) => {
    const formattedType = type?.toLowerCase() ?? "";
    switch (formattedType) {
      case "sale":
      case "sales":
        return {
          label: t("dashboard.types.sale"),
          icon: <ShoppingBag className="h-3.5 w-3.5" />,
          colorClass: "bg-emerald-500/10 text-emerald-500",
        };
      case "purchase":
      case "purchases":
        return {
          label: t("dashboard.types.purchase"),
          icon: <Receipt className="h-3.5 w-3.5" />,
          colorClass: "bg-blue-500/10 text-blue-500",
        };
      case "customer_return":
      case "customer return":
        return {
          label: t("dashboard.types.customer_return"),
          icon: <RotateCcw className="h-3.5 w-3.5" />,
          colorClass: "bg-rose-500/10 text-rose-500",
        };
      case "supplier_return":
      case "supplier return":
        return {
          label: t("dashboard.types.supplier_return"),
          icon: <Truck className="h-3.5 w-3.5" />,
          colorClass: "bg-amber-500/10 text-amber-500",
        };
      default:
        return {
          label: type,
          icon: <Receipt className="h-3.5 w-3.5" />,
          colorClass: "bg-muted text-muted-foreground",
        };
    }
  };

  return (
    <Card data-aos="fade-up" className="border-border/60 shadow-xs">
      <CardHeader className="pb-3 border-b border-border/40 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold">
          {t("dashboard.transactions.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full space-y-4"
        >
          <div className="overflow-x-auto pb-1">
            <TabsList className="bg-muted/50 p-1 rounded-xl h-auto inline-flex whitespace-nowrap">
              <TabsTrigger
                value="all"
                className="text-xs rounded-lg px-3 py-1.5"
              >
                {t("dashboard.tabs.all")}
              </TabsTrigger>
              <TabsTrigger
                value="sales"
                className="text-xs rounded-lg px-3 py-1.5"
              >
                {t("dashboard.tabs.sales")}
              </TabsTrigger>
              <TabsTrigger
                value="purchases"
                className="text-xs rounded-lg px-3 py-1.5"
              >
                {t("dashboard.tabs.purchases")}
              </TabsTrigger>
              <TabsTrigger
                value="customer-returns"
                className="text-xs rounded-lg px-3 py-1.5"
              >
                {t("dashboard.tabs.customer_returns")}
              </TabsTrigger>
              <TabsTrigger
                value="supplier-returns"
                className="text-xs rounded-lg px-3 py-1.5"
              >
                {t("dashboard.tabs.supplier_returns")}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="m-0">
            {isTransactionsLoading ? (
              <div className="space-y-3 pt-2">
                <Skeleton className="h-10 w-full bg-muted-foreground/15 animate-pulse" />
                <Skeleton className="h-10 w-full bg-muted-foreground/15 animate-pulse" />
                <Skeleton className="h-10 w-full bg-muted-foreground/15 animate-pulse" />
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-xs">
                {t("dashboard.transactions.no_data")}
              </div>
            ) : (
              <div className="rounded-xl border border-border/40 overflow-hidden">
                <Table className="text-xs">
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="w-45">
                        {t("dashboard.table.type")}
                      </TableHead>
                      <TableHead>{t("dashboard.table.reference")}</TableHead>
                      <TableHead>{t("dashboard.table.date_time")}</TableHead>
                      <TableHead>{t("dashboard.table.amount")}</TableHead>
                      <TableHead className="text-right">
                        {t("dashboard.table.status")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="font-medium">
                    {filteredTransactions.map(
                      (tx: TransactionItem, index: number) => {
                        const typeInfo = renderTypeDetails(tx.type);
                        return (
                          <TableRow
                            key={tx.id ?? index}
                            className="hover:bg-muted/20"
                          >
                            <TableCell className="py-3">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`p-1.5 rounded-md ${typeInfo.colorClass}`}
                                >
                                  {typeInfo.icon}
                                </span>
                                <span className="font-semibold">
                                  {typeInfo.label}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-muted-foreground">
                              {tx.id ?? t("dashboard.common.not_available")}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {tx.invoice_date ??
                                  tx.created_at ??
                                  t("dashboard.common.not_available")}
                              </div>
                            </TableCell>
                            <TableCell className="font-mono font-bold">
                              SYP{tx.amount?.toLocaleString() ?? 0}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge
                                variant="outline"
                                className="border-emerald-500/30 text-emerald-500 bg-emerald-500/5 font-semibold capitalize"
                              >
                                {tx.payment_status
                                  ? t(
                                      `dashboard.status.${tx.payment_status.toLowerCase()}`,
                                      { defaultValue: tx.payment_status },
                                    )
                                  : t("dashboard.status.completed")}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      },
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
