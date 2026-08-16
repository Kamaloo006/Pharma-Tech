// features/dashboard/pages/DashboardHome.tsx
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { DashboardKpis } from "@/features/dashboard/components/DashboardKPIs";
import { WeeklyRevenueChart } from "@/features/dashboard/components/WeeklyRevenueChart";
import { RecentTransactionsTable } from "@/features/dashboard/components/RecentTransactionsTable";

export default function DashboardHome() {
  useEffect(() => {
    AOS.init({ duration: 600, once: true, easing: "ease-out-cubic" });
  }, []);

  return (
    <div className="space-y-6 p-6 pb-12 max-w-7xl mx-auto overflow-hidden">
      <DashboardHeader />
      <DashboardKpis />
      <WeeklyRevenueChart />
      <RecentTransactionsTable />
    </div>
  );
}
