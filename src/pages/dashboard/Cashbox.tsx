// features/finance/pages/CashBoxPage.tsx
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

import { useCashBox } from "@/features/cashbox/hooks/useCashbox";
import CreateCashBoxForm from "@/features/cashbox/components/CreateCashBoxFrom";
import StatCards from "@/features/cashbox/components/StatCards";
import CashBoxChart from "@/features/cashbox/components/CashBoxChart";
import TransactionsTable from "@/features/cashbox/components/TransactionsTable";

export default function CashBoxPage() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  // تفعيل TanStack Query Hook الموحد
  const { cashBox, statistics, isLoading, isSubmitting, createCashBox } =
    useCashBox();

  // 1️⃣ فحص شاشة الانتظار
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground mt-4">
          {isArabic
            ? "جاري تحميل بيانات الصندوق..."
            : "Loading cash box data..."}
        </p>
      </div>
    );
  }

  // 2️⃣ شاشة الإدخال الأولي عند عدم توفر صندوق مالي
  if (!cashBox) {
    return (
      <CreateCashBoxForm onCreate={createCashBox} isSubmitting={isSubmitting} />
    );
  }

  // 3️⃣ اللوحة الرئيسية بمكوناتها المعزولة
  return (
    <div className="p-6 space-y-6" dir={isArabic ? "rtl" : "ltr"}>
      {/* الهيدر العلوي */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          {isArabic ? "إدارة الصندوق المالي" : "Cash Box Management"}
        </h1>
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          {isArabic ? "نشط ومفتوح" : "Active & Open"}
        </span>
      </div>

      {/* 📊 بطاقات الإحصائيات (Stat Cards Component) */}
      <StatCards cashBox={cashBox} statistics={statistics} />

      {/* 📈 مخطط تدفق السيولة (Chart Component) */}
      <CashBoxChart cashBoxId={cashBox.id} />

      {/* 📄 جدول العمليات المفلتر مع الـ Pagination */}
      <TransactionsTable cashBoxId={cashBox.id} />
    </div>
  );
}
