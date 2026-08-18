import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { DashboardKpis } from "@/features/dashboard/components/DashboardKpis";
import { WeeklyRevenueChart } from "@/features/dashboard/components/WeeklyRevenueChart";
import { RecentTransactionsTable } from "@/features/dashboard/components/RecentTransactionsTable";
import { useAuth } from "@/context/AuthContext";

export default function DashboardHome() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (user?.role === "pharmacy_owner") {
      AOS.init({ duration: 600, once: true, easing: "ease-out-cubic" });
    }
  }, [user]);

  if (isLoading) {
    return null;
  }

  if (user?.role !== "pharmacy_owner") {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="space-y-6 p-6 pb-12 max-w-8xl mx-auto overflow-hidden">
      <DashboardHeader />
      <DashboardKpis />
      <WeeklyRevenueChart />
      <RecentTransactionsTable />
    </div>
  );
}
