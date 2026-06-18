import AppSidebar from "@/components/dashboard/app-sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const currentDir = isArabic ? "rtl" : "ltr";

  return (
    <SidebarProvider dir={currentDir} style={{ direction: currentDir }}>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
