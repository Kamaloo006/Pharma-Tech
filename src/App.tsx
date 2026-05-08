import { Moon, Pill, ShieldCheck, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "./context/theme-provider";
import { Separator } from "./components/ui/separator";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const App = () => {
  const { t, i18n } = useTranslation();
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-10">
      <section className="w-full rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-10">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs text-secondary-foreground">
          <Pill className="size-4" />
          منصة صيدلية متوافقة مع RTL
        </div>

        <Separator className="my-6" />
        <h1 className="text-2xl text-center  tracking-tight sm:text-4xl font-bold text-primary">
          {t("welcomeMessage")}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          تم إعداد المشروع باستخدام Tailwind CSS و shadcn/ui مع دعم الكتابة من
          اليمين إلى اليسار. يمكنك الآن إضافة المكونات عبر أمر shadcn بسهولة.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button>{t("addMedicine")}</Button>
          <Button variant="outline">
            <ShieldCheck className="size-4" />
            مراجعة المخزون
          </Button>
          {theme === "dark" ? (
            <Button onClick={() => setTheme("light")}>
              <Sun className="size-4 cursor-pointer" />
              تبديل الوضع
            </Button>
          ) : (
            <Button onClick={() => setTheme("dark")}>
              <Moon className="size-4 cursor-pointer" />
              تبديل الوضع
            </Button>
          )}

          <Button onClick={toggleLanguage}>{t("switchLanguage")}</Button>
        </div>
      </section>
    </main>
  );
};

export default App;
