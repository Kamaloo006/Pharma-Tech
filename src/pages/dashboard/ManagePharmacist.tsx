import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Users,
  UserPlus,
  Pencil,
  Trash2,
  Search,
  MoreHorizontal,
  Loader2,
  Lock,
  Mail,
  User as UserIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import clsx from "clsx";

const pharmacistSchema = z.object({
  id: z.number().optional(),
  first_name: z.string().min(2, "الاسم الأول مطلوب"),
  father_name: z.string().optional().nullable(),
  last_name: z.string().min(2, "اللقب مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z
    .string()
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
    .optional()
    .or(z.literal("")),
});

type PharmacistFormData = z.infer<typeof pharmacistSchema>;

interface Pharmacist {
  id: number;
  first_name: string;
  father_name?: string | null;
  last_name: string;
  email: string;
  role: "pharmacist";
  created_at: string;
}

const INITIAL_PHARMACISTS: Pharmacist[] = [
  {
    id: 1,
    first_name: "أحمد",
    father_name: "محمد",
    last_name: "العلي",
    email: "ahmed@example.com",
    role: "pharmacist",
    created_at: "2026-01-15",
  },
  {
    id: 2,
    first_name: "سارة",
    father_name: "خالد",
    last_name: "الحسن",
    email: "sara@example.com",
    role: "pharmacist",
    created_at: "2026-03-10",
  },
];

export default function ManagePharmacist() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [pharmacists, setPharmacists] =
    useState<Pharmacist[]>(INITIAL_PHARMACISTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPharmacist, setEditingPharmacist] = useState<Pharmacist | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const form = useForm<PharmacistFormData>({
    resolver: zodResolver(pharmacistSchema),
    defaultValues: {
      first_name: "",
      father_name: "",
      last_name: "",
      email: "",
      password: "",
    },
  });

  const handleOpenAddModal = () => {
    setEditingPharmacist(null);
    form.reset({
      first_name: "",
      father_name: "",
      last_name: "",
      email: "",
      password: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (pharmacist: Pharmacist) => {
    setEditingPharmacist(pharmacist);
    form.reset({
      id: pharmacist.id,
      first_name: pharmacist.first_name,
      father_name: pharmacist.father_name || "",
      last_name: pharmacist.last_name,
      email: pharmacist.email,
      password: "",
    });
    setIsModalOpen(true);
  };

  const onSubmit = (data: PharmacistFormData) => {
    if (editingPharmacist) {
      setPharmacists((prev) =>
        prev.map((item) =>
          item.id === editingPharmacist.id
            ? {
                ...item,
                first_name: data.first_name,
                father_name: data.father_name,
                last_name: data.last_name,
                email: data.email,
              }
            : item,
        ),
      );
    } else {
      const newPharmacist: Pharmacist = {
        id: Date.now(),
        first_name: data.first_name,
        father_name: data.father_name,
        last_name: data.last_name,
        email: data.email,
        role: "pharmacist",
        created_at: new Date().toISOString().split("T")[0],
      };
      setPharmacists((prev) => [newPharmacist, ...prev]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setPharmacists((prev) => prev.filter((item) => item.id !== id));
    setDeletingId(null);
  };

  const filteredPharmacists = pharmacists.filter((p) => {
    const fullName =
      `${p.first_name} ${p.father_name || ""} ${p.last_name}`.toLowerCase();
    const query = searchTerm.toLowerCase();
    return fullName.includes(query) || p.email.toLowerCase().includes(query);
  });

  return (
    <div
      className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
            <Users className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              إدارة الصيادلة
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              عرض وإدارة حسابات الصيادلة المسجلين في الصيدلية
            </p>
          </div>
        </div>

        <Button
          onClick={handleOpenAddModal}
          className="gap-2 rounded-xl text-xs h-10 px-4 self-start sm:self-auto"
        >
          <UserPlus className="size-4" />
          <span>إضافة صيدلي جديد</span>
        </Button>
      </div>

      {/* Main Table Card */}
      <Card className="border-border/60 shadow-xs bg-card rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/40 bg-muted/20 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <span>قائمة الصيادلة</span>
            <Badge variant="secondary" className="rounded-full text-xs px-2.5">
              {filteredPharmacists.length}
            </Badge>
          </CardTitle>

          <div className="relative w-full sm:w-72">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto" />
            <Input
              placeholder="بحث بالاسم أو البريد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rtl:pr-9 ltr:pl-9 bg-background border-border/70 rounded-xl text-xs h-9"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/40">
                <TableHead
                  className={clsx({
                    "text-right": isArabic,
                    "text-left": !isArabic,
                  })}
                >
                  الاسم الكامل
                </TableHead>
                <TableHead
                  className={clsx({
                    "text-right": isArabic,
                    "text-left": !isArabic,
                  })}
                >
                  البريد الإلكتروني
                </TableHead>
                <TableHead
                  className={clsx({
                    "text-right": isArabic,
                    "text-left": !isArabic,
                  })}
                >
                  الدور
                </TableHead>
                <TableHead
                  className={clsx({
                    "text-right": isArabic,
                    "text-left": !isArabic,
                  })}
                >
                  تاريخ الإضافة
                </TableHead>
                <TableHead className="w-16 text-center">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPharmacists.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-12 text-muted-foreground text-xs"
                  >
                    لا يوجد صيادلة مطبق عليهم البحث حالياً
                  </TableCell>
                </TableRow>
              ) : (
                filteredPharmacists.map((pharmacist) => (
                  <TableRow
                    key={pharmacist.id}
                    className="border-border/40 hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-medium text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                          {pharmacist.first_name[0]}
                        </div>
                        <span>
                          {pharmacist.first_name}{" "}
                          {pharmacist.father_name
                            ? `${pharmacist.father_name} `
                            : ""}
                          {pharmacist.last_name}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {pharmacist.email}
                    </TableCell>

                    <TableCell>
                      <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-[11px] font-normal px-2.5 py-0.5">
                        صيدلي (Pharmacist)
                      </Badge>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {pharmacist.created_at}
                    </TableCell>

                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-lg"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="rounded-xl w-36"
                        >
                          <DropdownMenuItem
                            onClick={() => handleOpenEditModal(pharmacist)}
                            className="gap-2 text-xs cursor-pointer"
                          >
                            <Pencil className="size-3.5 text-blue-500" />
                            <span>تعديل</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeletingId(pharmacist.id)}
                            className="gap-2 text-xs text-rose-500 focus:text-rose-500 cursor-pointer"
                          >
                            <Trash2 className="size-3.5" />
                            <span>حذف</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add / Edit Pharmacist Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="max-w-lg rounded-2xl p-6"
          dir={isArabic ? "rtl" : "ltr"}
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <UserIcon className="size-5 text-primary" />
              <span>
                {editingPharmacist ? "تعديل بيانات صيدلي" : "إضافة صيدلي جديد"}
              </span>
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 pt-2"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">
                        الاسم الأول <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أحمد"
                          className="rounded-xl text-xs h-9"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="father_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">اسم الأب</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="محمد"
                          className="rounded-xl text-xs h-9"
                          value={field.value ?? ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">
                        اللقب <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="العلي"
                          className="rounded-xl text-xs h-9"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">
                      البريد الإلكتروني <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto" />
                        <Input
                          type="email"
                          placeholder="pharmacist@example.com"
                          className="rtl:pr-9 ltr:pl-9 rounded-xl text-xs h-9"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">
                      كلمة المرور{" "}
                      {!editingPharmacist && (
                        <span className="text-rose-500">*</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto" />
                        <Input
                          type="password"
                          placeholder={
                            editingPharmacist
                              ? "اتركه فارغاً لإبقاء كلمة المرور القديمة"
                              : "••••••••"
                          }
                          className="rtl:pr-9 ltr:pl-9 rounded-xl text-xs h-9"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4 border-t border-border/40 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl text-xs h-9 px-4"
                >
                  إلغاء
                </Button>

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="rounded-xl text-xs h-9 px-5 gap-2"
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className="size-3.5 animate-spin" />
                  )}
                  <span>{editingPharmacist ? "تعديل" : "إضافة"}</span>
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={deletingId !== null}
        onOpenChange={() => setDeletingId(null)}
      >
        <DialogContent
          className="max-w-md rounded-2xl p-6"
          dir={isArabic ? "rtl" : "ltr"}
        >
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-rose-500">
              تأكيد حذف الصيدلي
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground leading-relaxed pt-2">
            هل أنت تأكد من إزالة هذا الصيدلي من النظام؟ لن يتمكن من الوصول إلى
            لوحة التحكم بعد الحذف.
          </p>
          <DialogFooter className="pt-4 gap-2">
            <Button
              variant="outline"
              onClick={() => setDeletingId(null)}
              className="rounded-xl text-xs h-9 px-4"
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingId && handleDelete(deletingId)}
              className="rounded-xl text-xs h-9 px-5"
            >
              تأكيد الحذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
