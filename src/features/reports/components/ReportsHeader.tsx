import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw } from "lucide-react";
import { type ReportPeriod } from "@/features/reports/types/SalesReports";

interface ReportsHeaderProps {
  period: ReportPeriod;
  setPeriod: (period: ReportPeriod) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function ReportsHeader({
  period,
  setPeriod,
  onRefresh,
  isRefreshing,
}: ReportsHeaderProps) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <div
      data-aos="fade-down"
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-5 rounded-2xl border border-border shadow-xs"
    >
      <div>
        <h1 className="text-xl font-bold tracking-tight">
          {isArabic ? "مرحباً بعودتك" : "Welcome back"}
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {isArabic
            ? "إليك ما يحدث في صيدليتك اليوم"
            : "Here's what's happening in your pharmacy"}
        </p>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Select
          value={period}
          onValueChange={(v: ReportPeriod) => setPeriod(v)}
        >
          <SelectTrigger className="h-9 text-xs w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-border text-foreground z-50">
            <SelectItem value="daily" className="text-xs">
              {isArabic ? "يومي" : "Daily"}
            </SelectItem>
            <SelectItem value="weekly" className="text-xs">
              {isArabic ? "أسبوعي" : "Weekly"}
            </SelectItem>
            <SelectItem value="monthly" className="text-xs">
              {isArabic ? "شهري" : "Monthly"}
            </SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-9 gap-2 text-xs rounded-xl font-medium"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isArabic ? "تحديث" : "Refresh"}
        </Button>
      </div>
    </div>
  );
}
