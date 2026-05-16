// import { type FormEvent, useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Building2, MoonStar, ShieldCheck, SunMedium } from "lucide-react";
// import { useTranslation } from "react-i18next";
// import clsx from "clsx";
// import { Button } from "@/components/ui/button";
// // Card UI provided by AuthCard
// import AuthForm from "@/components/auth/AuthForm";
// import { useTheme } from "@/context/theme-provider";
// import AuthCard from "@/components/auth/AuthCard";

// const AdminLogin = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { t, i18n } = useTranslation();
//   const { theme, setTheme } = useTheme();
//   const [identifier, setIdentifier] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const fromPath =
//     (location.state as { from?: { pathname?: string } } | null)?.from
//       ?.pathname ?? "/dashboard";

//   useEffect(() => {
//     document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
//     document.documentElement.lang = i18n.language;
//   }, [i18n.language]);

//   const isArabic = i18n.language === "ar";

//   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setIsSubmitting(true);
//     // TODO: Replace with real admin authentication flow when this page is re-enabled.
//     navigate(fromPath, { replace: true });
//   };

//   return (
//     <main className="min-h-screen bg-background text-foreground transition-all duration-300">
//       <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-4 sm:px-6 lg:px-8">
//         <header
//           className={clsx("flex items-center gap-3 pb-4", {
//             "justify-start": !isArabic,
//             "justify-end": isArabic,
//           })}
//         >
//           <div className="flex items-center gap-1 rounded-full border border-border bg-header-bg p-1 shadow-sm backdrop-blur transition-all duration-300">
//             <Button
//               type="button"
//               size="sm"
//               className={clsx(
//                 "h-8 rounded-full px-3 transition-all duration-300",
//                 {
//                   "bg-primary/30 text-primary font-semibold hover:bg-primary/40":
//                     i18n.language === "en",
//                   "bg-transparent text-muted-foreground hover:bg-muted/50":
//                     i18n.language !== "en",
//                 },
//               )}
//               onClick={() => i18n.changeLanguage("en")}
//             >
//               EN
//             </Button>
//             <Button
//               type="button"
//               size="sm"
//               className={clsx(
//                 "h-8 rounded-full px-3 transition-all duration-300",
//                 {
//                   "bg-primary/30 text-primary font-semibold hover:bg-primary/40":
//                     i18n.language === "ar",
//                   "bg-transparent text-muted-foreground hover:bg-muted/50":
//                     i18n.language !== "ar",
//                 },
//               )}
//               onClick={() => i18n.changeLanguage("ar")}
//             >
//               AR
//             </Button>
//           </div>

//           <Button
//             type="button"
//             variant="outline"
//             size="icon"
//             className="size-10 rounded-full border border-border bg-header-bg shadow-sm backdrop-blur transition-all duration-300"
//             onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//           >
//             {theme === "dark" ? (
//               <SunMedium className="size-4" />
//             ) : (
//               <MoonStar className="size-4" />
//             )}
//           </Button>
//         </header>

//         <section className="flex flex-1 items-center justify-center py-6">
//           <div className="relative w-full max-w-2xl overflow-hidden rounded-4xl border border-border bg-background-alpha p-6 shadow-2xl shadow-primary/10 backdrop-blur sm:p-8 lg:p-10">
//             <div className="pointer-events-none absolute left-0 top-0 h-56 w-56 -translate-x-1/3 -translate-y-1/3 rounded-full bg-[radial-gradient(circle_at_top_left,rgba(5,150,105,0.24),transparent_68%)] blur-3xl dark:bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_68%)]" />

//             <div className="relative z-10 mb-6 flex flex-col items-center text-center">
//               <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
//                 <ShieldCheck className="size-7" />
//               </div>
//               <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-badge-border bg-badge-border/10 px-3 py-1 text-xs font-medium text-badge-text">
//                 <Building2 className="size-4" />
//                 {t("adminLogin.badge")}
//               </p>
//               <h1 className="mt-4 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
//                 {t("adminLogin.title")}
//               </h1>
//               <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
//                 {t("adminLogin.description")}
//               </p>
//             </div>

//             <AuthCard
//               titleKey="adminLogin.cardTitle"
//               descriptionKey="adminLogin.cardDescription"
//               roleTagKey="adminLogin.roleTag"
//               className="relative z-10"
//             >
//               <AuthForm
//                 prefix="adminLogin"
//                 identifier={identifier}
//                 setIdentifier={setIdentifier}
//                 password={password}
//                 setPassword={setPassword}
//                 showPassword={showPassword}
//                 setShowPassword={setShowPassword}
//                 isArabic={isArabic}
//                 rememberMe={rememberMe}
//                 setRememberMe={setRememberMe}
//                 isSubmitting={isSubmitting}
//                 onSubmit={handleSubmit}
//                 footer={
//                   <div className="relative z-10 mt-5 flex justify-center text-sm text-muted-foreground">
//                     <Button
//                       type="button"
//                       variant="link"
//                       className="h-auto px-0 text-sm"
//                       onClick={() => navigate("/login/pharmacist")}
//                     >
//                       {t("adminLogin.switchToPharmacist")}
//                     </Button>
//                   </div>
//                 }
//               />
//             </AuthCard>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// };

// export default AdminLogin;
