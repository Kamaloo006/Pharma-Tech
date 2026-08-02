import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, PlusCircle } from "lucide-react";

interface InvoiceHeaderProps {
  isArabic: boolean;
  isSaving: boolean;
  isSaveDisabled: boolean;
  onSave: () => void;
}

export function InvoiceHeader({
  isArabic,
  isSaving,
  isSaveDisabled,
  onSave,
}: InvoiceHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/60 pb-4">
      <div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {isArabic ? "إنشاء فاتورة مبيعات" : "Create Sales Invoice"}
          </h1>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {isArabic
            ? "إضافة منتجات، إدارة المبالغ المدفوعة، وإنشاء الفاتورة"
            : "Issue a new sales invoice, manage items, discounts, and payment terms."}
        </p>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <Button
          size="sm"
          onClick={onSave}
          disabled={isSaveDisabled}
          className="h-9 px-6 text-xs font-bold gap-2 shadow-sm rounded-xl transition-all"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <PlusCircle className="h-4 w-4" />
          )}
          <span>
            {isSaving
              ? isArabic
                ? "جاري الحفظ..."
                : "Creating Invoice..."
              : isArabic
                ? "إنشاء الفاتورة"
                : "Create Invoice"}
          </span>
        </Button>
      </div>
    </div>
  );
}
