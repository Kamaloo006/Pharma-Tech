import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { usePredictNeeds } from "../hooks/usePredictNeeds";
import {
  Loader2,
  CloudSun,
  Sparkles,
  AlertCircle,
  PackageCheck,
} from "lucide-react";
import clsx from "clsx";

interface WeatherPredictModalProps {
  isOpen: boolean;
  onClose: () => void;
  isArabic: boolean;
}

export default function WeatherPredictModal({
  isOpen,
  onClose,
  isArabic,
}: WeatherPredictModalProps) {
  const { data, isLoading, isError, refetch } = usePredictNeeds(isOpen);

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
                  ? "توقعات الذكاء الاصطناعي والمناخ"
                  : "AI Weather & Inventory Predictions"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {isArabic
                  ? "تحليل تأثير حالة الطقس الحالية على احتياجات المخزون والطلب المتوقع"
                  : "Analyze current weather conditions impact on inventory demand"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
            <Loader2 className="size-8 animate-spin text-violet-600" />
            <p className="text-xs font-medium">
              {isArabic
                ? "جاري تحليل البيانات والطقس..."
                : "Analyzing weather & predicting needs..."}
            </p>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-8 text-center text-rose-500 gap-2">
            <AlertCircle className="size-8 opacity-80" />
            <p className="text-sm font-semibold">
              {isArabic ? "فشل في جلب التوقعات" : "Failed to load predictions"}
            </p>
            <button
              onClick={() => refetch()}
              className="text-xs underline text-muted-foreground hover:text-foreground mt-1"
            >
              {isArabic ? "إعادة المحاولة" : "Try again"}
            </button>
          </div>
        )}

        {!isLoading && !isError && data && (
          <div className="space-y-5 pt-2">
            <div className="flex items-center justify-between rounded-xl bg-violet-500/5 border border-violet-500/20 p-4">
              <div className="flex items-center gap-3">
                <CloudSun className="size-6 text-amber-500" />
                <div>
                  <span className="text-xs text-muted-foreground block">
                    {isArabic ? "حالة الطقس الحالية" : "Current Weather"}
                  </span>
                  <span className="text-sm font-bold text-violet-900 dark:text-violet-200">
                    {data.weather_summary}
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                {data.status}
              </span>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <PackageCheck className="size-4 text-violet-600" />
                {isArabic
                  ? "توصيات المنتجات والأدوية"
                  : "Product & Stock Recommendations"}
              </h4>

              <div className="space-y-3">
                {data.ai_recommendations.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-border/80 bg-card/50 p-4 space-y-2 hover:border-violet-500/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md">
                        {item.product_name}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {item.advice}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
