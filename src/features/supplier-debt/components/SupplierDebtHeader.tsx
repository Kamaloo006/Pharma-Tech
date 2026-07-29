import React from "react";
import { useTranslation } from "react-i18next";
import { Wallet, DollarSign, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import CountUpModule from "react-countup";

const CountUp = (CountUpModule as any).default || CountUpModule;

interface SummaryTotals {
  total: number;
  paid: number;
  remaining: number;
}

interface SupplierDebtHeaderProps {
  totals?: SummaryTotals;
  formatCurrency?: (amount: number) => string;
}

const DebtStatCard = React.memo(
  ({
    title,
    value,
    textColor,
    bgColor,
    iconColor,
    icon,
    formatCurrency,
  }: {
    title: string;
    value: number;
    textColor: string;
    bgColor: string;
    iconColor: string;
    icon: React.ReactNode;
    formatCurrency: (amount: number) => string;
  }) => {
    return (
      <Card className="border-border/60 shadow-xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-muted-foreground">
              {title}
            </p>
            <p className={`text-lg font-bold font-mono ${textColor}`}>
              <CountUp
                end={value}
                decimals={2}
                duration={1.2}
                preserveValue={true}
                formattingFn={(val: number) => formatCurrency(val)}
              />
            </p>
          </div>
          <div
            className={`h-9 w-9 rounded-lg ${bgColor} flex items-center justify-center ${iconColor}`}
          >
            {icon}
          </div>
        </CardContent>
      </Card>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.value === nextProps.value && prevProps.title === nextProps.title
    );
  },
);

DebtStatCard.displayName = "DebtStatCard";

export function SupplierDebtHeader({
  totals = { total: 0, paid: 0, remaining: 0 },
  formatCurrency,
}: SupplierDebtHeaderProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const defaultFormatCurrency = (amt: number) =>
    `${amt.toLocaleString()} ${t("common.currency", "YER")}`;

  const formatter = formatCurrency || defaultFormatCurrency;

  const cards = [
    {
      title: t("supplierDebt.header.totalAmount", "Total Debt"),
      value: totals.total,
      textColor: "text-foreground",
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      title: t("supplierDebt.header.paidAmount", "Paid Amount"),
      value: totals.paid,
      textColor: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      icon: <CheckCircle2 className="h-5 w-5" />,
    },
    {
      title: t("supplierDebt.header.remainingAmount", "Remaining Due"),
      value: totals.remaining,
      textColor: "text-destructive",
      bgColor: "bg-destructive/10",
      iconColor: "text-destructive",
      icon: <AlertCircle className="h-5 w-5" />,
    },
  ];

  return (
    <div className="space-y-4 mb-6" dir={isArabic ? "rtl" : "ltr"}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            {t("supplierDebt.header.title", "Supplier Debts")}
            <Wallet className="h-6 w-6 text-primary" />
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {t(
              "supplierDebt.header.description",
              "Manage and track payables and debts owed to suppliers.",
            )}
          </p>
        </div>
      </div>

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
            formatCurrency={formatter}
          />
        ))}
      </div>
    </div>
  );
}
