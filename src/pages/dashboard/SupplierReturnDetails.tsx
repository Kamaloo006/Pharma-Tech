import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSupplierReturnDetails } from "@/features/supplier-return/hooks/useSupplierReturns";

import { ReturnDetailsHeader } from "@/features/supplier-return/components/supplier-return-details/ReturnDetailsHeader";
import { ReturnMetadataGrid } from "@/features/supplier-return/components/supplier-return-details/ReturnMetaDataGrid";
import { ReturnItemsTable } from "@/features/supplier-return/components/supplier-return-details/ReturnItemsTable";
import { ReturnFinancialSummary } from "@/features/supplier-return/components/supplier-return-details/ReturnFinancialSummary";

export default function SupplierReturnDetailsPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isArabic = i18n.language === "ar";

  const { data, isLoading, isError } = useSupplierReturnDetails(id);
  const returnDetails = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !returnDetails) {
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-destructive text-sm font-semibold">
          {t("supplierReturn.details.error", "Failed to load return details.")}
        </p>
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard/supplier-return")}
        >
          {t("common.back", "Go Back")}
        </Button>
      </div>
    );
  }

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="space-y-6 max-w-8xl px-6 mx-auto"
    >
      {/* 1. Header */}
      <ReturnDetailsHeader details={returnDetails} isArabic={isArabic} />

      {/* 2. Metadata Grid */}
      <ReturnMetadataGrid details={returnDetails} isArabic={isArabic} />

      {/* 3. Items Table & Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ReturnItemsTable items={returnDetails.items} isArabic={isArabic} />
        <ReturnFinancialSummary details={returnDetails} />
      </div>
    </div>
  );
}
