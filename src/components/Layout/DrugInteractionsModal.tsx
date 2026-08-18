import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Loader2,
  ShieldAlert,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import clsx from "clsx";
import type { DrugInteractionResponse } from "@/types/DrugInteractions";

interface DrugInteractionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isArabic: boolean;
  isLoading: boolean;
  data: DrugInteractionResponse | undefined;
  isError: boolean;
  onRetry: () => void;
}

export default function DrugInteractionsModal({
  isOpen,
  onClose,
  isArabic,
  isLoading,
  data,
  isError,
  onRetry,
}: DrugInteractionsModalProps) {
  const hasInteractions = Boolean(
    data?.interactions && data.interactions.length > 0,
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={clsx(
          "max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6",
          isArabic && "[&>button]:right-auto [&>button]:left-4",
        )}
        dir={isArabic ? "rtl" : "ltr"}
      >
        <DialogHeader className="space-y-2 pb-4 border-b border-border/60">
          <div className="flex items-center gap-3 text-start">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
              <Sparkles className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                {isArabic
                  ? "فحص التداخلات الدوائية بالذكاء الاصطناعي"
                  : "AI Drug Interaction Check"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {isArabic
                  ? "تحليل التفاعلات والتداخلات الدوائية بين الأدوية المختارة في الفاتورة"
                  : "Analyzing interactions between selected medicines in this invoice"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
            <Loader2 className="size-8 animate-spin text-violet-600" />
            <p className="text-xs font-medium">
              {isArabic
                ? "جاري تحليل التداخلات الدوائية..."
                : "Checking drug interactions..."}
            </p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-8 text-center text-rose-500 gap-2">
            <AlertTriangle className="size-8 opacity-80" />
            <p className="text-sm font-semibold">
              {isArabic
                ? "حدث خطأ أثناء فحص التداخلات"
                : "Failed to check interactions"}
            </p>
            <button
              onClick={onRetry}
              className="text-xs underline text-muted-foreground hover:text-foreground mt-1"
            >
              {isArabic ? "إعادة المحاولة" : "Try again"}
            </button>
          </div>
        )}

        {/* Success / Result State */}
        {!isLoading && !isError && data && (
          <div className="space-y-5 pt-2">
            {/* Header Banner */}
            <div
              className={clsx(
                "flex items-center gap-3 rounded-xl border p-4",
                hasInteractions
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300"
                  : "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300",
              )}
            >
              {hasInteractions ? (
                <ShieldAlert className="size-6 shrink-0 text-rose-600" />
              ) : (
                <CheckCircle2 className="size-6 shrink-0 text-emerald-600" />
              )}
              <div>
                <h4 className="text-sm font-bold">
                  {hasInteractions
                    ? isArabic
                      ? `تم تمييز ${data.interactions.length} تداخل/تنبيه دوائي`
                      : `Detected ${data.interactions.length} Drug Interactions`
                    : isArabic
                      ? "لا توجد تداخلات دوائية معروفة بين الأدوية المحددة"
                      : "No Known Drug Interactions Found"}
                </h4>
              </div>
            </div>

            {/* List of Detailed Interactions */}
            {hasInteractions && (
              <div className="space-y-3">
                {data.interactions.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-2 text-start"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-foreground">
                        {isArabic
                          ? `تنبيه رقم ${idx + 1}`
                          : `Warning #${idx + 1}`}
                      </span>
                      <span
                        className={clsx(
                          "text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full",
                          item.severity?.toLowerCase() === "high"
                            ? "bg-rose-500/20 text-rose-600"
                            : item.severity?.toLowerCase() === "medium"
                              ? "bg-amber-500/20 text-amber-600"
                              : "bg-blue-500/20 text-blue-600",
                        )}
                      >
                        {item.severity}
                      </span>
                    </div>

                    <p className="text-xs leading-relaxed text-muted-foreground pt-1">
                      {item.interaction}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
