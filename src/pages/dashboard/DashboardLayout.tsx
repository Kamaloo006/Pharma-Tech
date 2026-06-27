import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/Layout/app-sidebar";
import DashboardHeader from "@/components/Layout/DashboardHeader";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function DashboardLayout() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const currentDir = isArabic ? "rtl" : "ltr";

  return (
    // تمرير الاتجاه ديناميكياً للـ Provider لمنع مشاكل الفراغات المخفية
    <SidebarProvider dir={currentDir} style={{ direction: currentDir }}>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        {/* 1️⃣ استدعاء السايدبار الجانبي */}
        <AppSidebar />

        {/* الحاوية اليمنى/اليسرى للمحتوى والنافبار */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* 2️⃣ استدعاء الهيدر العلوي (النافبار) */}
          <DashboardHeader />

          {/* 3️⃣ مساحة عرض الصفحات الديناميكية (مثل صفحة الـ Inventory) */}
          <main className="flex-1 p-4 md:p-6 max-w-400 w-full mx-auto animate-fadeIn">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
