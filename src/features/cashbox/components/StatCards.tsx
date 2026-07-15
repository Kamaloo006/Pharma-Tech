// features/finance/components/StatCards.tsx
import { useTranslation } from "react-i18next";
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import type { CashBox, CashBoxStats } from "../types/cashBox";
import CountUpModule from "react-countup";

const CountUp = (CountUpModule as any).default || CountUpModule;

interface StatCardsProps {
  cashBox: CashBox;
  statistics: CashBoxStats | null;
}

export default function StatCards({ cashBox, statistics }: StatCardsProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const todayIn = statistics?.today?.in ?? 0;
  const todayOut = statistics?.today?.out ?? 0;

  const cards = [
    {
      title: t("cashbox.stats.openingBalance"),
      value: cashBox.opening_balance,
      icon: <Wallet className="h-4 w-4 text-amber-500" />,
      textClass: "text-foreground",
    },
    {
      title: t("cashbox.stats.currentBalance"),
      value: cashBox.current_balance,
      icon: <TrendingUp className="h-4 w-4 text-primary" />,
      textClass: "text-foreground",
    },
    {
      title: t("cashbox.stats.todayCashIn"),
      value: todayIn,
      icon: (
        <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
          <ArrowUpRight className="h-3.5 w-3.5" />
        </div>
      ),
      textClass: "text-emerald-400",
    },
    {
      title: t("cashbox.stats.todayCashOut"),
      value: todayOut,
      icon: (
        <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
          <ArrowDownLeft className="h-3.5 w-3.5" />
        </div>
      ),
      textClass: "text-destructive",
    },
  ];

  return (
    <div
      className="grid gap-4 sm:grid-cols-2 md:grid-cols-4"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {cards.map((card, index) => (
        <div
          key={index}
          className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-2 text-start"
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">{card.title}</span>
            {card.icon}
          </div>
          <p className={`text-xl font-bold font-mono ${card.textClass}`}>
            <CountUp end={card.value} decimals={2} />
          </p>
        </div>
      ))}
    </div>
  );
}
