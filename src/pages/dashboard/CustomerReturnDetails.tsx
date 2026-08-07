import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCustomerReturnDetails } from "@/features/customer-return/hooks/useCustomerReturns";

import { CustomerReturnDetailsHeader } from "@/features/customer-return/components/return-details/CustomerReturnDetailsHeader";
import { CustomerReturnMetadataGrid } from "@/features/customer-return/components/return-details/CustomerReturnMetaDataGrid";
import { CustomerReturnItemsTable } from "@/features/customer-return/components/return-details/CustomerReturnItemsTable";
import { CustomerReturnFinancialSummary } from "@/features/customer-return/components/return-details/CustomerReturnFinancialSummary";

export default function CustomerReturnDetailsPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isArabic = i18n.language === "ar";

  const { data, isLoading, isError } = useCustomerReturnDetails(id);
  const returnDetails = data?.data;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          {t("common.loading", "جاري التحميل...")}
        </p>
      </div>
    );
  }

  if (isError || !returnDetails) {
    return (
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="p-6 text-center space-y-4 max-w-md mx-auto my-12"
      >
        <p className="text-destructive text-sm font-semibold">
          {t("customerReturn.details.error", "فشل في تحميل تفاصيل المرتجع.")}
        </p>
        <Button
          variant="outline"
          onClick={() => navigate("dashboard/customer-return")}
        >
          {t("common.back", "العودة للخلف")}
        </Button>
      </div>
    );
  }

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="space-y-6 max-w-8xl px-6 mx-auto"
    >
      <CustomerReturnDetailsHeader
        details={returnDetails}
        isArabic={isArabic}
      />

      <CustomerReturnMetadataGrid details={returnDetails} isArabic={isArabic} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CustomerReturnItemsTable
          items={returnDetails.items || []}
          isArabic={isArabic}
        />
        <CustomerReturnFinancialSummary
          details={returnDetails}
          isArabic={isArabic}
        />
      </div>
    </div>
  );
}
