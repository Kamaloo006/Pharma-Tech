import { AlertCircle, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProductErrorStateProps {
  status?: number;
  isArabic: boolean;
  onRetry?: () => void;
}

export default function ProductErrorState({
  status,
  isArabic,
  onRetry,
}: ProductErrorStateProps) {
  const navigate = useNavigate();

  const is404Or403 = status === 404 || status === 403;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 space-y-6 text-center animate-in fade-in duration-200">
      <div className="p-4 rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="h-10 w-10" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold text-foreground">
          {is404Or403
            ? isArabic
              ? "المنتج غير موجود"
              : "Product Not Found"
            : isArabic
              ? "فشل الاتصال بالسيرفر"
              : "Connection Failed"}
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          {is404Or403
            ? isArabic
              ? "المنتج الذي تبحث عنه غير موجود أو لا يتبع لهذه الصيدلية."
              : "The requested product does not exist or you don't have access to it."
            : isArabic
              ? "تعذر تحميل بيانات المنتج بسبب مشكلة في الشبكة، يرجى المحاولة مجدداً."
              : "Unable to load product data due to network error. Please try again."}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {is404Or403 ? (
          <Button
            onClick={() => navigate("/dashboard/inventory")}
            className="rounded-xl gap-2 font-bold"
          >
            {isArabic ? "العودة للمخزن" : "Back to Inventory"}
            <ArrowRight className={`h-4 w-4 ${isArabic ? "rotate-180" : ""}`} />
          </Button>
        ) : (
          <Button onClick={onRetry} className="rounded-xl gap-2 font-bold">
            <RotateCcw className="h-4 w-4" />
            {isArabic ? "إعادة المحاولة" : "Retry Loading"}
          </Button>
        )}
      </div>
    </div>
  );
}
