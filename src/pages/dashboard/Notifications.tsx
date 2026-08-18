import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import {
  Bell,
  CheckCheck,
  FileText,
  ShoppingBag,
  CreditCard,
  Clock,
  Loader2,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Inbox,
} from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/useNotifications";
import { type NotificationItem } from "@/types/Notification";

const Notifications = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } =
    useNotifications();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "unread" | "read">(
    "all",
  );
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  // Refresh AOS elements whenever notifications list changes
  useEffect(() => {
    AOS.refresh();
  }, [notifications, filterStatus, filterType, searchTerm]);

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
        return data.supplier_debt_id
          ? `/dashboard/supplier-debt/${data.supplier_debt_id}`
          : null;

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

  const getNotificationDetails = (type?: string) => {
    switch (type) {
      case "sale_invoice_created":
        return {
          icon: <FileText className="size-5 text-emerald-500" />,
          bgColor: "bg-emerald-500/10 border-emerald-500/20",
          label: t("notifications.types.sale_invoice_created"),
        };
      case "purchase_invoice_created":
        return {
          icon: <ShoppingBag className="size-5 text-blue-500" />,
          bgColor: "bg-blue-500/10 border-blue-500/20",
          label: t("notifications.types.purchase_invoice_created"),
        };
      case "customer_debt_created":
      case "supplier_debt_created":
        return {
          icon: <CreditCard className="size-5 text-amber-500" />,
          bgColor: "bg-amber-500/10 border-amber-500/20",
          label: t("notifications.types.debt_record"),
        };
      case "customer_return_created":
      case "supplier_return_created":
        return {
          icon: <RotateCcw className="size-5 text-purple-500" />,
          bgColor: "bg-purple-500/10 border-purple-500/20",
          label: t("notifications.types.return_record"),
        };
      case "low_stock_alert":
      case "product_alert":
        return {
          icon: <AlertTriangle className="size-5 text-rose-500" />,
          bgColor: "bg-rose-500/10 border-rose-500/20",
          label: t("notifications.types.low_stock_alert"),
        };
      default:
        return {
          icon: <Bell className="size-5 text-primary" />,
          bgColor: "bg-primary/10 border-primary/20",
          label: t("notifications.types.general"),
        };
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return t("notifications.time.just_now");
    if (diffInMinutes < 60)
      return t("notifications.time.minutes_ago", { count: diffInMinutes });

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24)
      return t("notifications.time.hours_ago", { count: diffInHours });

    return date.toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (filterStatus === "unread" && item.read_at !== null) return false;
      if (filterStatus === "read" && item.read_at === null) return false;

      if (filterType !== "all") {
        if (filterType === "customer_debt_created") {
          if (
            item.data?.type !== "customer_debt_created" &&
            item.data?.type !== "customer_debt_payment"
          ) {
            return false;
          }
        } else if (item.data?.type !== filterType) {
          return false;
        }
      }

      if (searchTerm.trim() !== "") {
        const query = searchTerm.toLowerCase();
        const titleMatch = item.title?.toLowerCase().includes(query);
        const bodyMatch = item.body?.toLowerCase().includes(query);
        const invMatch = item.data?.invoice_number
          ?.toLowerCase()
          .includes(query);
        return titleMatch || bodyMatch || invMatch;
      }

      return true;
    });
  }, [notifications, filterStatus, filterType, searchTerm]);

  const handleItemClick = (item: NotificationItem) => {
    if (item.read_at === null) {
      markAsRead(item.id);
    }
  };

  const handleNavigateDetails = (
    e: React.MouseEvent,
    item: NotificationItem,
  ) => {
    e.stopPropagation();
    if (item.read_at === null) {
      markAsRead(item.id);
    }
    const route = getNotificationRoute(item);
    if (route) {
      navigate(route);
    }
  };

  const filterTypes = [
    { key: "all", label: t("notifications.filters.all_types") },
    { key: "sale_invoice_created", label: t("notifications.filters.sales") },
    {
      key: "purchase_invoice_created",
      label: t("notifications.filters.purchases"),
    },
    { key: "low_stock_alert", label: t("notifications.filters.stock") },
    {
      key: "customer_debt_created",
      label: t("notifications.filters.customer_debts"),
    },
    {
      key: "supplier_debt_created",
      label: t("notifications.filters.supplier_debts"),
    },
    {
      key: "supplier_return_created",
      label: t("notifications.filters.supplier_returns"),
    },
    {
      key: "customer_return_created",
      label: t("notifications.filters.customer_returns"),
    },
  ];

  return (
    <div
      className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto min-h-[calc(100vh-80px)]"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Header Section */}
      <div
        data-aos="fade-down"
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/40"
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
              <Bell className="size-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {t("notifications.page_title")}
              </h1>
            </div>
          </div>
        </div>

        {unreadCount > 0 && (
          <Button
            onClick={() => markAllAsRead()}
            variant="outline"
            className="self-start sm:self-auto gap-2 bg-background border-border/80 shadow-xs hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all rounded-xl text-xs h-10 px-4"
          >
            <CheckCheck className="size-4" />
            <span>
              {t("notifications.mark_all_read")} ({unreadCount})
            </span>
          </Button>
        )}
      </div>

      {/* Search and Filters Card */}
      <Card
        data-aos="fade-up"
        data-aos-delay="100"
        className="border-border/60 shadow-xs bg-card/60 backdrop-blur-xs rounded-2xl overflow-hidden"
      >
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto" />
              <Input
                placeholder={t("notifications.search_placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rtl:pr-9 ltr:pl-9 bg-background/80 border-border/70 rounded-xl text-xs h-10 focus-visible:ring-primary/30"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <Button
                size="sm"
                variant={filterStatus === "all" ? "default" : "ghost"}
                onClick={() => setFilterStatus("all")}
                className="rounded-xl text-xs h-9 px-3.5"
              >
                {t("notifications.status.all")} ({notifications.length})
              </Button>
              <Button
                size="sm"
                variant={filterStatus === "unread" ? "default" : "ghost"}
                onClick={() => setFilterStatus("unread")}
                className="rounded-xl text-xs h-9 px-3.5 gap-1.5"
              >
                <span>{t("notifications.status.unread")}</span>
                {unreadCount > 0 && (
                  <Badge className="bg-primary-foreground text-primary hover:bg-primary-foreground text-[10px] px-1.5 py-0 h-4 rounded-full">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
              <Button
                size="sm"
                variant={filterStatus === "read" ? "default" : "ghost"}
                onClick={() => setFilterStatus("read")}
                className="rounded-xl text-xs h-9 px-3.5"
              >
                {t("notifications.status.read")}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-border/40 overflow-x-auto text-xs">
            <span className="text-muted-foreground shrink-0 font-medium flex items-center gap-1">
              <Filter className="size-3.5" />
              {t("notifications.filter_by_type")}
            </span>
            <div className="flex items-center gap-1.5">
              {filterTypes.map((typeItem) => (
                <button
                  key={typeItem.key}
                  type="button"
                  onClick={() => setFilterType(typeItem.key)}
                  className={clsx(
                    "px-3 py-1 rounded-lg transition-all text-xs border font-medium whitespace-nowrap cursor-pointer",
                    filterType === typeItem.key
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-background/50 border-border/50 text-muted-foreground hover:bg-muted/40",
                  )}
                >
                  {typeItem.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="size-8 animate-spin text-primary" />
            <span className="text-xs font-medium">
              {t("notifications.loading_full")}
            </span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Card
            data-aos="zoom-in"
            className="border-dashed border-border/80 bg-card/30"
          >
            <CardContent className="py-16 flex flex-col items-center justify-center text-center space-y-3">
              <div className="p-4 rounded-full bg-muted/30 border border-border/50">
                <Inbox className="size-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground">
                  {t("notifications.no_match_title")}
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm">
                  {t("notifications.no_match_desc")}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((item, index) => {
            const isUnread = item.read_at === null;
            const details = getNotificationDetails(item.data?.type);
            const route = getNotificationRoute(item);

            return (
              <Card
                key={item.id}
                data-aos="fade-up"
                data-aos-delay={Math.min(index * 50, 300)}
                onClick={() => handleItemClick(item)}
                className={clsx(
                  "border transition-all duration-200 cursor-pointer overflow-hidden group hover:shadow-md",
                  isUnread
                    ? "bg-primary/5 border-primary/30 shadow-xs"
                    : "bg-card border-border/60 hover:border-border",
                )}
              >
                <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={clsx(
                        "p-3 rounded-2xl border shrink-0 transition-transform group-hover:scale-105",
                        details.bgColor,
                      )}
                    >
                      {details.icon}
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-foreground">
                          {item.title}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[10px] px-2 py-0.5 rounded-md border-border/60 bg-background/50 font-normal text-muted-foreground"
                        >
                          {details.label}
                        </Badge>
                        {isUnread && (
                          <Badge className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-medium">
                            {t("notifications.new")}
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
                        {item.body}
                      </p>

                      <div className="flex items-center gap-4 pt-1 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="size-3.5 text-muted-foreground/70" />
                          {formatTime(item.created_at)}
                        </span>

                        {item.data?.invoice_number && (
                          <span className="font-mono px-2 py-0.5 rounded-md bg-muted/50 border border-border/40 text-foreground font-medium">
                            #{item.data.invoice_number}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                    {route && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={(e) => handleNavigateDetails(e, item)}
                        className="rounded-xl text-xs h-9 px-3.5 gap-1.5 shadow-xs transition-all"
                      >
                        <span>{t("notifications.view_details")}</span>
                        <ExternalLink className="size-3.5" />
                      </Button>
                    )}

                    {isUnread && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(item.id);
                        }}
                        className="rounded-xl text-xs h-9 px-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        title={t("notifications.mark_as_read")}
                      >
                        <CheckCircle2 className="size-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;
