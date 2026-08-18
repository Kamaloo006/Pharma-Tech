import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useTranslation } from "react-i18next";
import { User, UserPlus, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Zod Schema مع رسائل التحقق
export const addPharmacistSchema = z.object({
  first_name: z.string().min(2, "الاسم الأول مطلوب (حرفين على الأقل)"),
  father_name: z.string().optional().nullable(),
  last_name: z.string().min(2, "اللقب/اسم العائلة مطلوب"),
  email: z.string().email("يرجى إدخال بريد إلكتروني صحيح"),
  phone_number: z
    .string()
    .min(8, "رقم الهاتف يجب أن يتكون من 8 أرقام على الأقل"),
  role: z.enum(["pharmacy_owner", "pharmacist", "system_admin"]),
});

export type AddPharmacistFormData = z.infer<typeof addPharmacistSchema>;

const AddPharmacist = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const form = useForm<AddPharmacistFormData>({
    resolver: zodResolver(addPharmacistSchema),
    defaultValues: {
      first_name: "",
      father_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      role: "pharmacist",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: AddPharmacistFormData) => {
    try {
      console.log("Form Data:", data);
      // TODO: قم باستدعاء الـ API الخاص بكتنزيل/إضافة الصيدلاني هنا
      // await createPharmacistApi(data);
    } catch (error) {
      console.error("Error creating pharmacist:", error);
    }
  };

  return (
    <div
      className="p-6 lg:p-8 space-y-6 max-w-4xl mx-auto"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
            <UserPlus className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              إضافة صيدلاني جديد
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              قم بملء البيانات التالية لإضافة مستخدم جديد إلى النظام
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="gap-2 rounded-xl text-xs h-10 px-4"
        >
          <ArrowRight className="size-4 rtl:rotate-0 ltr:rotate-180" />
          <span>رجوع</span>
        </Button>
      </div>

      {/* Form Card */}
      <Card className="border-border/60 shadow-xs bg-card rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/40 bg-muted/20 px-6 py-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <User className="size-4 text-primary" />
            <span>المعلومات الشخصية والوظيفية</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">
                        الاسم الأول <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل الاسم الأول"
                          className="rounded-xl text-xs h-10"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="father_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">
                        اسم الأب (اختياري)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل اسم الأب"
                          className="rounded-xl text-xs h-10"
                          value={field.value ?? ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">
                        اللقب / العائلة <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل اللقب"
                          className="rounded-xl text-xs h-10"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Contact Info & Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">
                        البريد الإلكتروني{" "}
                        <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@domain.com"
                          className="rounded-xl text-xs h-10 dir-ltr text-right"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">
                        رقم الهاتف <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="0912345678"
                          className="rounded-xl text-xs h-10 font-mono"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="rounded-xl text-xs h-10 px-5"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-xl text-xs h-10 px-6 gap-2"
                >
                  {isLoading && <Loader2 className="size-4 animate-spin" />}
                  <span>حفظ البيانات</span>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPharmacist;
