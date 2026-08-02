import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Search,
  User as UserIcon,
  ChevronsUpDown,
  Check,
  Loader2,
  X,
} from "lucide-react";
import type { Customer } from "@/features/customers/types/Customer";

interface CustomerSelectorCardProps {
  isArabic: boolean;
  customerId: string | null;
  setCustomerId: (id: string | null) => void;
  selectedCustomer: Customer | null;
  customersList: Customer[];
  isLoadingCustomers: boolean;
  customerSearch: string;
  setCustomerSearch: (q: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function CustomerSelectorCard({
  isArabic,
  customerId,
  setCustomerId,
  selectedCustomer,
  customersList,
  isLoadingCustomers,
  customerSearch,
  setCustomerSearch,
  isOpen,
  setIsOpen,
}: CustomerSelectorCardProps) {
  return (
    <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden">
      <CardHeader className="bg-muted/20 border-b border-border/60 pb-3">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <UserIcon className="h-4 w-4 text-primary" />
          {isArabic ? "اختيار الزبون" : "Customer Selection"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground">
              {isArabic ? "حدد الزبون" : "Select Customer"}
            </span>

            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isOpen}
                  className="w-full h-9 justify-between rounded-xl bg-background text-xs font-semibold px-3"
                >
                  <span className="truncate">
                    {selectedCustomer
                      ? `${selectedCustomer.full_name} (${selectedCustomer.phone || "No phone"})`
                      : isArabic
                        ? "🚶 زبون نقدي (نقدي)"
                        : "🚶 Walk-in Customer (Guest)"}
                  </span>
                  <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="w-75 p-2 bg-background border-border shadow-md rounded-xl space-y-2"
                align="start"
              >
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder={
                      isArabic
                        ? "بحث عن اسم أو رقم..."
                        : "Search customer name or phone..."
                    }
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="h-8 pl-8 text-xs rounded-lg"
                  />
                </div>

                <div className="max-h-52 overflow-y-auto space-y-1">
                  <div
                    onClick={() => {
                      setCustomerId(null);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs font-semibold cursor-pointer hover:bg-muted/60 transition-colors ${
                      !customerId ? "bg-primary/10 text-primary" : ""
                    }`}
                  >
                    <span>
                      {isArabic
                        ? "🚶 زبون نقدي (نقدي)"
                        : "🚶 Walk-in Customer (Guest)"}
                    </span>
                    {!customerId && <Check className="h-3.5 w-3.5" />}
                  </div>

                  {isLoadingCustomers ? (
                    <div className="flex items-center justify-center p-4 text-xs text-muted-foreground gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      {isArabic ? "جاري التحميل..." : "Loading customers..."}
                    </div>
                  ) : customersList.length === 0 ? (
                    <div className="p-3 text-center text-xs text-muted-foreground font-medium">
                      {isArabic
                        ? "لم يتم العثور على زبائن"
                        : "No customers found."}
                    </div>
                  ) : (
                    customersList.map((cust) => {
                      const isSelected = customerId === String(cust.id);
                      return (
                        <div
                          key={cust.id}
                          onClick={() => {
                            setCustomerId(String(cust.id));
                            setIsOpen(false);
                          }}
                          className={`flex items-center justify-between p-2 rounded-lg text-xs font-semibold cursor-pointer hover:bg-muted/60 transition-colors ${
                            isSelected ? "bg-primary/10 text-primary" : ""
                          }`}
                        >
                          <div>
                            <div className="font-bold">{cust.full_name}</div>
                            <div className="text-[10px] text-muted-foreground font-mono">
                              {cust.phone || "No phone"}
                            </div>
                          </div>
                          {isSelected && <Check className="h-3.5 w-3.5" />}
                        </div>
                      );
                    })
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50 text-xs min-h-13">
            {selectedCustomer ? (
              <>
                <div className="space-y-0.5">
                  <div className="font-bold text-foreground">
                    {selectedCustomer.full_name}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono">
                    Phone: {selectedCustomer.phone || "N/A"} | ID: #
                    {selectedCustomer.id}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCustomerId(null)}
                  className="h-6 w-6 text-muted-foreground hover:text-destructive rounded-lg"
                  title="Clear customer"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </>
            ) : (
              <div className="text-muted-foreground font-medium text-[11px]">
                {isArabic
                  ? "بيع نقدي مباشر (بدون تسجيل زبون)"
                  : "Standard Walk-in Sale (No customer record attached)"}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
