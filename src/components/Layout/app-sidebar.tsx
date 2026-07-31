import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Boxes,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  LogOut,
  DollarSign,
  ReceiptText,
  NotebookPen,
  WalletCards,
  Repeat,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import clsx from "clsx";
import { useAuth } from "@/context/AuthContext";

export default function AppSidebar() {
  const { t, i18n } = useTranslation();
  const { toggleSidebar, open, isMobile } = useSidebar();
  const location = useLocation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const { user, logout, pharmacy } = useAuth();

  const navigationGroups = [
    {
      label: t("sidebar.mainMenu"),
      items: [
        {
          title: t("sidebar.dashboard"),
          icon: LayoutDashboard,
          url: "/dashboard",
        },
        {
          title: t("sidebar.inventory"),
          icon: Boxes,
          url: "/dashboard/inventory",
        },
        {
          title: t("sidebar.cashbox"),
          icon: DollarSign,
          url: "/dashboard/cashbox",
        },
      ],
    },

    {
      label: t("sidebar.management"),
      items: [
        {
          title: t("sidebar.purchases"),
          icon: ReceiptText,
          url: "/dashboard/purchases",
        },
        {
          title: t("sidebar.newPurchase"),
          icon: NotebookPen,
          url: "/dashboard/purchases/new",
        },
      ],
    },
    {
      label: t("sidebar.suppliers"),
      items: [
        {
          title: t("sidebar.suppliersList"),
          icon: Users,
          url: "/dashboard/suppliers",
        },
        {
          title: t("sidebar.supplierDebt"),
          icon: WalletCards,
          url: "/dashboard/supplier-debt",
        },
        {
          title: t("sidebar.supplierReturn"),
          icon: Repeat,
          url: "/dashboard/supplier-return",
        },
      ],
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login/pharmacist");
  };

  return (
    <>
      {/* الـ Overlay والـ Blur للشاشات الكبيرة كما طلبته */}
      {open && !isMobile && (
        <button
          type="button"
          aria-label={t("header.closeSidebar")}
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 hidden bg-black/10 backdrop-blur-md transition-all duration-300 md:block"
        />
      )}

      <Sidebar
        collapsible="icon"
        side={isArabic ? "right" : "left"}
        className="z-50 border-r border-sidebar-border/80 bg-sidebar text-sidebar-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_50px_rgba(2,6,23,0.28)] transition-transform duration-300 ease-in-out"
      >
        <SidebarHeader className="border-b border-sidebar-border/70 px-3 py-3">
          {open || isMobile ? (
            <div
              dir={isArabic ? "rtl" : "ltr"}
              className="flex w-full items-center gap-2 rounded-full border border-sidebar-border/70 bg-background/5 px-2 py-2 backdrop-blur-sm"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <span className="text-md font-semibold">
                  {pharmacy?.name?.charAt(0)}
                </span>
              </div>
              <div className="min-w-0 flex-1 leading-tight">
                <div className="truncate text-base font-semibold text-sidebar-foreground">
                  {pharmacy?.name}
                </div>
                <div className="truncate text-xs text-sidebar-foreground/65">
                  Pharmacy
                </div>
              </div>
              <button
                type="button"
                onClick={toggleSidebar}
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
                aria-label={t("header.collapseSidebar")}
              >
                {isArabic ? (
                  <ChevronRight className="size-4" />
                ) : (
                  <ChevronLeft className="size-4" />
                )}
              </button>
            </div>
          ) : (
            <div className="flex w-full justify-center">
              <button
                type="button"
                onClick={toggleSidebar}
                className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
                aria-label={t("header.expandSidebar")}
              >
                <span className="text-md font-semibold">
                  {pharmacy?.name?.charAt(0)}
                </span>
              </button>
            </div>
          )}
        </SidebarHeader>

        <SidebarContent className="px-2 py-3">
          {navigationGroups.map((group, index) => (
            <SidebarGroup key={index} className="px-0 py-1">
              {(open || isMobile) && (
                <SidebarGroupLabel
                  className="px-3 flex text-[11px] font-semibold uppercase tracking-[0.2em] text-sidebar-foreground/45"
                  dir={isArabic ? "rtl" : "ltr"}
                >
                  {group.label}
                </SidebarGroupLabel>
              )}
              <SidebarMenu className="mt-1 gap-1">
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url}
                      tooltip={item.title}
                      className={clsx(
                        "group h-11 rounded-2xl px-3 text-sm font-medium text-sidebar-foreground/75 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-foreground data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-lg data-[active=true]:shadow-primary/20",
                        !open && !isMobile && "justify-center",
                      )}
                    >
                      <Link
                        to={item.url}
                        dir={isArabic ? "rtl" : "ltr"}
                        className={clsx(
                          "flex w-full items-center",
                          open || isMobile
                            ? "gap-3 justify-start"
                            : "justify-center",
                        )}
                      >
                        <item.icon className="size-4 shrink-0" />
                        {(open || isMobile) && (
                          <span className="truncate">{item.title}</span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border/70 p-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className={clsx(
                      "h-auto w-full rounded-2xl border border-sidebar-border/70 bg-background/5 p-2 transition-colors hover:bg-sidebar-accent/60",
                      !open && !isMobile && "justify-center",
                    )}
                  >
                    <div
                      dir={isArabic ? "rtl" : "ltr"}
                      className={clsx(
                        "flex min-w-0 flex-1 items-center overflow-hidden",
                        open || isMobile
                          ? "gap-3 justify-start"
                          : "justify-center",
                      )}
                    >
                      <Avatar className="size-10 shrink-0 border border-sidebar-border/70">
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="Pharmacist"
                        />
                        <AvatarFallback>
                          {user?.first_name
                            ? user.first_name.substring(0, 2).toUpperCase()
                            : "PM"}
                        </AvatarFallback>
                      </Avatar>
                      {(open || isMobile) && (
                        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                          <span className="truncate text-sm font-semibold text-sidebar-foreground">
                            {user?.first_name}
                          </span>
                          <span className="truncate text-xs text-sidebar-foreground/60">
                            {user?.email}
                          </span>
                        </div>
                      )}
                    </div>
                    {(open || isMobile) && (
                      <ChevronsUpDown className="size-4 shrink-0 text-sidebar-foreground/55" />
                    )}
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align={isArabic ? "start" : "end"}
                  className="w-56 rounded-2xl border-border/70 bg-card p-1 shadow-xl shadow-slate-950/20"
                >
                  <DropdownMenuItem
                    dir={isArabic ? "rtl" : "ltr"}
                    className="cursor-pointer gap-2 rounded-xl"
                  >
                    <Settings className="size-4" />
                    <span>{t("sidebar.profileSettings")}</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    dir={isArabic ? "rtl" : "ltr"}
                    onClick={handleLogout}
                    className="cursor-pointer gap-2 rounded-xl text-red-500 focus:bg-red-500/10 focus:text-red-500"
                  >
                    <LogOut className="size-4" />
                    <span>{t("sidebar.logOut")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </>
  );
}
