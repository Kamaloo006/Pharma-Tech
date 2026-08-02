import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Phone } from "lucide-react";
import type { Customer } from "@/features/customers/types/Customer";

interface CustomerCardProps {
  customer: Customer | null | undefined;
}

export function CustomerCard({ customer }: CustomerCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden">
      <CardHeader className="bg-muted/20 border-b border-border/60 py-2.5 px-4">
        <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-primary" />
          {t("salesInvoice.customer.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 font-bold text-foreground text-sm">
          <span className="text-base">👤</span>
          {customer?.full_name || t("salesInvoice.walkInCustomer")}
        </div>
        {customer?.phone && (
          <div className="flex items-center gap-1.5 font-mono text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-lg">
            <Phone className="h-3.5 w-3.5" />
            {customer.phone}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
