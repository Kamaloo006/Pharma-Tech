import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../auth/AuthHeader";
import {
  Bell,
  CheckCheck,
  FileText,
  ShoppingBag,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Clock,
  Loader2,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import clsx from "clsx";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useNotifications";
import { type NotificationItem } from "@/types/Notification";

const DashboardHeader = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } =
    useNotifications();

  const getNotificationRoute = (item: NotificationItem): string | null => {
    const data = item.data;
    if (!data || !data.type) return null;

    switch (data.type) {
      case "sale_invoice_created":
        return data.sales_invoice_id
          ? `/dashboard/sales-details/${data.sales_invoice_id}`
          : null;

      case "purchase_invoice_created":
        return data.purchase_invoice_id
          ? `/dashboard/purchase-details/${data.purchase_invoice_id}`
          : null;

      case "customer_debt_created":
      case "customer_debt_payment": {
        const debtId = data.customer_debt_id || data.customer_id;
        return debtId ? `/dashboard/customer-debt/${debtId}` : null;
      }

      case "supplier_debt_created":
      case "supplier_debt_payment": {
        const debtId = data.supplier_debt_id || data.supplier_id;
        return debtId ? `/dashboard/supplier-debt/${debtId}` : null;
      }

      case "customer_return_created":
        return data.customer_return_invoice_id
          ? `/dashboard/customer-return/${data.customer_return_invoice_id}`
          : null;

      case "supplier_return_created":
        return data.supplier_return_invoice_id
          ? `/dashboard/supplier-return/${data.supplier_return_invoice_id}`
          : null;

      case "low_stock_alert":
      case "product_alert":
        return data.product_id
          ? `/dashboard/product-details/${data.product_id}`
          : null;

      default:
        return null;
    }
  };

  const handleNotificationClick = (item: NotificationItem) => {
    if (item.read_at === null) {
      markAsRead(item.id);
    }
  };

  const handleNavigateToDetails = (
    e: React.MouseEvent,
    item: NotificationItem,
  ) => {
    e.stopPropagation();

    if (item.read_at === null) {
      markAsRead(item.id);
    }

    setIsOpen(false);

    const route = getNotificationRoute(item);
    if (route) {
      navigate(route);
    }
  };

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case "sale_invoice_created":
        return <FileText className="size-4 text-emerald-500" />;
      case "purchase_invoice_created":
        return <ShoppingBag className="size-4 text-blue-500" />;
      case "customer_debt_created":
      case "supplier_debt_created":
        return <CreditCard className="size-4 text-amber-500" />;
      case "customer_return_created":
      case "supplier_return_created":
        return <RotateCcw className="size-4 text-purple-500" />;
      case "low_stock_alert":
      case "product_alert":
        return <AlertTriangle className="size-4 text-rose-500" />;
      default:
        return <Bell className="size-4 text-primary" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return isArabic ? "الآن" : "Just now";
    if (diffInMinutes < 60)
      return isArabic ? `منذ ${diffInMinutes} دقيقة` : `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24)
      return isArabic ? `منذ ${diffInHours} ساعة` : `${diffInHours}h ago`;

    return date.toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className={clsx(
        "flex w-full items-center justify-between border-b border-border/40 bg-background/50 px-6 py-4 backdrop-blur-md sm:px-8 lg:px-10",
        {
          "flex-row-reverse": isArabic,
        },
      )}
    >
      <div
        className={clsx("flex flex-1 items-center gap-6", {
          "flex-row-reverse": isArabic,
        })}
      >
        <SidebarTrigger className="md:hidden size-10 rounded-full border border-border/60 bg-muted/20 text-foreground shadow-sm hover:bg-muted/40" />
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          <img
            src="/logo.png"
            loading="lazy"
            className="w-20 h-20 cursor-pointer"
          />
        </h1>
      </div>

      <div
        className={clsx("flex items-center gap-4", {
          "flex-row-reverse": isArabic,
        })}
      >
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="relative flex size-10 items-center justify-center rounded-full border border-border/80 bg-muted/10 text-foreground transition-all duration-300 hover:bg-muted/30 hover:border-primary/30 cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <Bell className="size-4 text-muted-foreground hover:text-foreground transition-colors" />

              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-in zoom-in">
                  {unreadCount}
                </span>
              )}
            </button>
          </PopoverTrigger>

          <PopoverContent
            align={isArabic ? "start" : "end"}
            className="w-80 bg-muted sm:w-96 p-0 shadow-xl border-border/60 rounded-2xl"
            dir={isArabic ? "rtl" : "ltr"}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/50 px-4 py-3 bg-muted/20">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">
                  {isArabic ? "الإشعارات" : "Notifications"}
                </span>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {unreadCount} {isArabic ? "جديد" : "new"}
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markAllAsRead()}
                  className="h-auto p-1.5 text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <CheckCheck className="size-3.5" />
                  <span>
                    {isArabic ? "تحديد الكل كمقروء" : "Mark all as read"}
                  </span>
                </Button>
              )}
            </div>

            {/* List */}
            <div className="max-h-85 overflow-y-auto divide-y divide-border/40">
              {isLoading ? (
                <div className="py-8 flex justify-center items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="size-4 animate-spin text-primary" />
                  <span>{isArabic ? "جاري التحميل..." : "Loading..."}</span>
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  {isArabic ? "لا يوجد إشعارات حالياً" : "No notifications yet"}
                </div>
              ) : (
                notifications.map((item: NotificationItem) => {
                  const isUnread = item.read_at === null;
                  const hasRoute = Boolean(getNotificationRoute(item));

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleNotificationClick(item)}
                      className={clsx(
                        "group relative flex items-start gap-3 p-3.5 transition-colors cursor-pointer hover:bg-primary/10",
                        {
                          "bg-primary/5 font-medium": isUnread,
                        },
                      )}
                    >
                      <div className="relative mt-0.5 shrink-0">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-background border border-border/60 shadow-xs">
                          {getNotificationIcon(item.data?.type)}
                        </div>
                        {isUnread && (
                          <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-primary ring-2 ring-background" />
                        )}
                      </div>

                      <div className="flex-1 space-y-1 text-xs pr-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-foreground text-xs line-clamp-1">
                            {item.title}
                          </span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1 shrink-0">
                            <Clock className="size-3" />
                            {formatTime(item.created_at)}
                          </span>
                        </div>

                        {item.data?.invoice_number && (
                          <div className="font-mono text-[11px] font-medium text-primary">
                            {item.data.invoice_number}
                          </div>
                        )}

                        <p className="text-muted-foreground text-[11px] leading-snug line-clamp-2">
                          {item.body}
                        </p>

                        {/* زر التفاصيل المضاف */}
                        {hasRoute && (
                          <div className="pt-1.5 flex justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => handleNavigateToDetails(e, item)}
                              className="h-7 px-2.5 text-[11px] font-medium gap-1 bg-background/50 hover:bg-background cursor-pointer hover:foreground transition-all shadow-xs rounded-lg border-border/80"
                            >
                              <span>{isArabic ? "التفاصيل" : "Details"}</span>
                              <ExternalLink className="size-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border/50 p-2 text-center bg-muted/10">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/dashboard/notifications");
                }}
                className="w-full text-xs text-muted-foreground hover:text-foreground justify-center gap-1 rounded-xl"
              >
                <span>
                  {isArabic ? "عرض كل الإشعارات" : "View all notifications"}
                </span>
                {isArabic ? (
                  <ArrowLeft className="size-3.5" />
                ) : (
                  <ArrowRight className="size-3.5" />
                )}
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex items-center pl-2 mt-4">
          <AuthHeader />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
