import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ExternalLink } from "lucide-react";

interface LiveAlertsProps {
  isArabic: boolean;
  paymentMethod: string;
  isCashBoxConfigured: boolean;
  hasDuplicateBatches: boolean;
  duplicateBatchNumbers: string[];
}

export function LiveAlerts({
  isArabic,
  paymentMethod,
  isCashBoxConfigured,
  hasDuplicateBatches,
  duplicateBatchNumbers,
}: LiveAlertsProps) {
  return (
    <div className="space-y-4">
      {paymentMethod === "cash" && !isCashBoxConfigured && (
        <Alert
          variant="destructive"
          className="rounded-2xl border-destructive/30 bg-destructive/5 text-destructive flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 text-start animate-in fade-in duration-300"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <AlertTitle className="text-xs font-bold">
                {isArabic
                  ? "صندوق النقود غير مهيأ!"
                  : "Cash Box is not configured!"}
              </AlertTitle>
              <AlertDescription className="text-[11px] text-destructive-foreground/80 mt-1">
                {isArabic
                  ? "لا يمكنك إجراء عمليات دفع نقدية بدون ربط صندوق نقود نشط بالمستخدم الحالي."
                  : "You cannot process cash transactions without configuring an active Cash Box."}
              </AlertDescription>
            </div>
          </div>
          <Button
            variant="destructive"
            className="h-9 text-xs font-bold gap-1.5 self-start md:self-auto shadow-sm"
          >
            <span>
              {isArabic ? "إنشاء وتفعيل كاش بوكس" : "Create Cash Box"}
            </span>
            <ExternalLink className="h-3 w-3" />
          </Button>
        </Alert>
      )}

      {hasDuplicateBatches && (
        <Alert className="rounded-2xl border-amber-500/30 bg-amber-500/5 text-amber-500 p-5 text-start animate-in fade-in duration-300">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <AlertTitle className="text-xs font-bold">
                {isArabic
                  ? "تكرار في أرقام التشغيلات (Batch Numbers)"
                  : "Duplicate Batch Numbers Detected!"}
              </AlertTitle>
              <AlertDescription className="text-[11px] text-amber-500/90 mt-1">
                {isArabic
                  ? `لقد قمت بتكرار الرقم (${duplicateBatchNumbers.join(", ")}) لأكثر من منتج في هذه الفاتورة. يرجى تعديلها لتفادي التداخل بالصيدلية.`
                  : `You've used the batch number (${duplicateBatchNumbers.join(", ")}) multiple times in this invoice. Please resolve.`}
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}
    </div>
  );
}
