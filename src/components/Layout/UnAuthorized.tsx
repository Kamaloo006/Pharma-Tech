import { ArrowLeft, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface UnauthorizedProps {
  message?: string;
  showLoginBtn?: boolean;
}

export const Unauthorized = ({
  message = "عفواً، ليس لديك الصلاحيات الكافية للوصول إلى هذه الصفحة",
  showLoginBtn = false,
}: UnauthorizedProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] mt-20 w-full flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 p-8">
        <img
          src="403.png"
          className="relative mx-auto animate-[bounce_4s_infinite]"
          loading="lazy"
          alt="403 Unauthorized"
        />

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            غير مصرح لك بالدخول لهذه الصفحة
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto gap-2 rounded-xl text-xs h-10 px-5"
          >
            <ArrowLeft className="size-4 rtl:rotate-180" />
            <span>الرجوع للخلف</span>
          </Button>

          {showLoginBtn && (
            <Button
              variant="ghost"
              onClick={() => navigate("/login/pharmacist")}
              className="w-full sm:w-auto gap-2 rounded-xl text-xs h-10 px-5"
            >
              <LogIn className="size-4" />
              <span>تسجيل الدخول</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
