import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Printer,
  FileText,
  DollarSign,
  Package,
  Layers,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  Calendar,
  User,
  Building2,
  XCircle,
  Undo2,
  RotateCcw,
  Ban,
} from "lucide-react";

// استيراد مكونات shadcn/ui
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// محاكاة لبيانات الفاتورة
const INITIAL_INVOICE_DETAILS = {
  id: "INV-2026-089",
  supplierName: "مجموعة الشفاء للأدوية (Al-Shifa Pharma)",
  date: "2026-07-15",
  createdBy: "كمال الخطيب (Kamal Al Khati)",
  status: "completed", // completed | cancelled
  paymentStatus: "partially_paid", // paid | partially_paid | unpaid
  paymentMethod: "Cash / Credit",

  subtotal: 1500.0,
  tax: 75.0,
  discount: 50.0,
  grandTotal: 1525.0,
  paid: 1000.0,
  remaining: 525.0,

  items: [
    {
      id: 1,
      productName: "Panadol Extra",
      dosage: "500mg",
      qty: 100,
      buyingPrice: 5.0,
      tax: 5,
      discount: 0.5,
      batchNumber: "BATCH-PAN-99",
      expiryDate: "2028-12-31",
      sellingPrice: 7.5,
      total: 475.0,
    },
    {
      id: 2,
      productName: "Amoxicillin",
      dosage: "250mg",
      qty: 50,
      buyingPrice: 20.0,
      tax: 5,
      discount: 0.0,
      batchNumber: "BATCH-AMX-44",
      expiryDate: "2027-06-30",
      sellingPrice: 28.0,
      total: 1050.0,
    },
  ],
};

export default function PurchaseInvoiceDetails() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  // إدارة حالة الفاتورة محلياً لتجربة التفاعل الحي عند الإلغاء
  const [invoice, setInvoice] = useState(INITIAL_INVOICE_DETAILS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const hasSupplierDebt = invoice.remaining > 0;
  const isCompleted = invoice.status === "completed";

  // دالة محاكاة إلغاء الفاتورة
  const handleCancelInvoice = () => {
    setInvoice((prev) => ({
      ...prev,
      status: "cancelled",
      paymentStatus: "unpaid",
      paid: 0,
      remaining: 0, // تصفير مديونية المورد تلقائياً عند الإلغاء
    }));
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6 p-6" dir={isArabic ? "rtl" : "ltr"}>
      {/* هيدر الصفحة وأزرار التحكم السريع */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-start">
          <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl">
            <ArrowLeft className={`h-4 w-4 ${isArabic ? "rotate-180" : ""}`} />
          </Button>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                {isArabic
                  ? `تفاصيل الفاتورة ${invoice.id}`
                  : `Invoice Details ${invoice.id}`}
              </h2>
              <Badge
                variant="outline"
                className={`text-[10px] font-bold ${
                  isCompleted
                    ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400"
                    : "border-destructive/30 bg-destructive/5 text-destructive"
                }`}
              >
                {isCompleted
                  ? isArabic
                    ? "تم ترحيلها بنجاح"
                    : "Successfully Posted"
                  : isArabic
                    ? "ملغاة ومسحوبة"
                    : "Cancelled & Reversed"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {isArabic
                ? "مراجعة بنود المشتريات، المخزون المستلم، والحسابات المالية الفورية."
                : "Review purchase items, received stocks, and financial summaries."}
            </p>
          </div>
        </div>

        {/* أزرار الإجراءات السريعة في الهيدر */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* عرض زر الإلغاء فقط إذا كانت الفاتورة نشطة ومعتمدة (Completed) */}
          {isCompleted && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-10 text-xs font-bold gap-2 text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <XCircle className="h-4 w-4" />
                  <span>{isArabic ? "إلغاء الفاتورة" : "Cancel Invoice"}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-muted border border-border sm:max-w-[420px] rounded-2xl text-start">
                <DialogHeader className="space-y-3">
                  <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                    <AlertCircle className="h-6 w-6 animate-pulse" />
                  </div>
                  <DialogTitle className="text-sm font-bold text-foreground">
                    {isArabic
                      ? "هل أنت متأكد من إلغاء هذه الفاتورة؟"
                      : "Are you sure you want to cancel?"}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground/90 space-y-3 pt-2">
                    <p className="font-semibold text-foreground">
                      {isArabic
                        ? "هذا الإجراء حساس جداً وسيؤدي فورياً إلى:"
                        : "This is a critical action that will immediately:"}
                    </p>
                    <ul className="space-y-2 list-disc list-inside text-destructive font-semibold bg-destructive/5 p-3 rounded-xl border border-destructive/10">
                      <li className="flex items-center gap-2">
                        <Undo2 className="h-3.5 w-3.5 shrink-0" />
                        <span>
                          {isArabic
                            ? "عكس وحذف الكميات من المستودع (Reverse Stock)"
                            : "Reverse Stock (Deduct Quantities)"}
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <RotateCcw className="h-3.5 w-3.5 shrink-0" />
                        <span>
                          {isArabic
                            ? "إرجاع الأموال المسحوبة من الكاش بوكس (Refund Cash)"
                            : "Refund Cash to Cash Box"}
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Ban className="h-3.5 w-3.5 shrink-0" />
                        <span>
                          {isArabic
                            ? "إغلاق ذمم المورد وتصفير دينه المترتب (Cancel Debt)"
                            : "Cancel Supplier Debt Record"}
                        </span>
                      </li>
                    </ul>
                    <p className="text-[11px] text-muted-foreground pt-1">
                      {isArabic
                        ? "هل ترغب في الاستمرار والتأكيد؟"
                        : "Would you like to continue?"}
                    </p>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex-row gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1 h-10 text-xs font-bold"
                  >
                    {isArabic ? "تراجع" : "Go Back"}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleCancelInvoice}
                    className="flex-1 h-10 text-xs font-bold shadow-md"
                  >
                    {isArabic ? "نعم، إلغاء الآن" : "Yes, Cancel Invoice"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          <Button variant="outline" className="h-10 text-xs font-bold gap-2">
            <Printer className="h-4 w-4 text-muted-foreground" />
            <span>{isArabic ? "طباعة الفاتورة" : "Print Invoice"}</span>
          </Button>
        </div>
      </div>

      {/* توزيع الصفحة بأسلوب ذكي: 3 أعمدة تفاعلية */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
        {/* العمود الأيمن الكبير (Card 1: Info + Card 2: Products) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Invoice Information */}
          <Card className="border-border bg-card shadow-sm rounded-2xl">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                {isArabic ? "معلومات الفاتورة العامة" : "Invoice Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 grid grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-4 text-start">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                  <FileText className="h-3 w-3" />{" "}
                  {isArabic ? "رقم الفاتورة" : "Invoice Number"}
                </span>
                <p className="text-xs font-bold text-foreground font-mono">
                  {invoice.id}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                  <Building2 className="h-3 w-3" />{" "}
                  {isArabic ? "المورد" : "Supplier"}
                </span>
                <p className="text-xs font-bold text-foreground truncate">
                  {invoice.supplierName}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />{" "}
                  {isArabic ? "التاريخ" : "Date"}
                </span>
                <p className="text-xs font-bold text-foreground font-mono">
                  {invoice.date}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" />{" "}
                  {isArabic ? "بواسطة" : "Created By"}
                </span>
                <p className="text-xs font-bold text-foreground">
                  {invoice.createdBy}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground">
                  {isArabic ? "الحالة" : "Status"}
                </span>
                <div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      isCompleted
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-destructive/10 text-destructive border-destructive/20"
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" />
                        {isArabic ? "مكتملة" : "Completed"}
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3" />
                        {isArabic ? "ملغاة" : "Cancelled"}
                      </>
                    )}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground">
                  {isArabic ? "حالة الدفع" : "Payment Status"}
                </span>
                <div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      invoice.paymentStatus === "paid"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : invoice.paymentStatus === "partially_paid"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : "bg-destructive/10 text-destructive border-destructive/20"
                    }`}
                  >
                    {invoice.paymentStatus === "paid" &&
                      (isArabic ? "مدفوعة بالكامل" : "Fully Paid")}
                    {invoice.paymentStatus === "partially_paid" &&
                      (isArabic ? "دفعة جزئية" : "Partially Paid")}
                    {invoice.paymentStatus === "unpaid" &&
                      (isArabic ? "مسترجعة / غير مدفوعة" : "Refunded / Unpaid")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Products Table */}
          <Card className="border-border bg-card shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                {isArabic ? "الأدوية والمنتجات المستلمة" : "Received Products"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table className="text-xs">
                  <TableHeader className="bg-muted/30">
                    <TableRow className="border-b border-border/65">
                      <TableHead
                        className={isArabic ? "text-right" : "text-left"}
                      >
                        {isArabic ? "المنتج" : "Product"}
                      </TableHead>
                      <TableHead className="text-center">
                        {isArabic ? "الكمية" : "Qty"}
                      </TableHead>
                      <TableHead className="text-center">
                        {isArabic ? "سعر الشراء" : "Buying Price"}
                      </TableHead>
                      <TableHead className="text-center">
                        {isArabic ? "الضريبة" : "Tax"}
                      </TableHead>
                      <TableHead className="text-center">
                        {isArabic ? "الخصم" : "Discount"}
                      </TableHead>
                      <TableHead className="text-center">
                        {isArabic ? "سعر البيع" : "Selling Price"}
                      </TableHead>
                      <TableHead
                        className={isArabic ? "text-left" : "text-right"}
                      >
                        {isArabic ? "الإجمالي" : "Total"}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.items.map((item) => (
                      <TableRow
                        key={item.id}
                        className="border-b border-border/40 hover:bg-muted/10"
                      >
                        <TableCell className="font-semibold text-foreground py-3.5 text-start">
                          <div className="space-y-0.5">
                            <div>{item.productName}</div>
                            <span className="px-1.5 py-0.2 rounded bg-muted text-muted-foreground text-[9px] font-bold">
                              {item.dosage}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-bold">
                          {item.qty}
                        </TableCell>
                        <TableCell className="text-center font-mono">
                          {item.buyingPrice.toFixed(2)} ل.س
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {item.tax}%
                        </TableCell>
                        <TableCell className="text-center text-destructive">
                          -{item.discount.toFixed(2)} ل.س
                        </TableCell>
                        <TableCell className="text-center text-emerald-500 font-semibold">
                          {item.sellingPrice.toFixed(2)} ل.س
                        </TableCell>
                        <TableCell
                          className={`font-bold text-foreground ${isArabic ? "text-left" : "text-right"}`}
                        >
                          {item.total.toFixed(2)} ل.س
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* العمود الأيسر الجانبي (Card 3: Totals + Card 4: Debt + Card 5: Stock) */}
        <div className="space-y-6">
          {/* Card 3: Totals */}
          <Card className="border-border bg-card shadow-sm rounded-2xl">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                {isArabic ? "الملخص المالي" : "Financial Totals"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">
                  {isArabic ? "المجموع الفرعي" : "Subtotal"}
                </span>
                <span className="font-semibold text-foreground">
                  {invoice.subtotal.toFixed(2)} ل.س
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">
                  {isArabic ? "الخصم" : "Discount"}
                </span>
                <span className="font-semibold text-destructive">
                  -{invoice.discount.toFixed(2)} ل.س
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">
                  {isArabic ? "الضريبة" : "Tax Value"}
                </span>
                <span className="font-semibold text-foreground">
                  +{invoice.tax.toFixed(2)} ل.س
                </span>
              </div>

              <div className="border-t border-border/60 pt-3 flex justify-between items-center">
                <span className="text-xs font-bold text-foreground">
                  {isArabic ? "المجموع الكلي" : "Grand Total"}
                </span>
                <span className="text-sm font-extrabold text-primary">
                  {invoice.grandTotal.toFixed(2)} ل.س
                </span>
              </div>

              <div className="border-t border-border/40 pt-3 flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-semibold text-emerald-500">
                  {isArabic ? "المبلغ المدفوع" : "Amount Paid"}
                </span>
                <span className="font-bold text-emerald-500">
                  {invoice.paid.toFixed(2)} ل.س
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-semibold text-destructive">
                  {isArabic ? "المبلغ المتبقي" : "Remaining Due"}
                </span>
                <span className="font-bold text-destructive">
                  {invoice.remaining.toFixed(2)} ل.س
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Supplier Debt (يعرض فقط في حال وجود دين نشط ومستحق للمورد) */}
          {hasSupplierDebt && isCompleted && (
            <Card className="border-destructive/20 bg-destructive/5 dark:bg-destructive/10 shadow-sm rounded-2xl animate-in fade-in duration-300">
              <CardHeader className="pb-3 border-b border-destructive/10">
                <CardTitle className="text-sm font-bold text-destructive flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {isArabic ? "ديون ذمم المورد" : "Supplier Debt"}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5 space-y-4 text-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground">
                    {isArabic ? "إجمالي الدين المترتب" : "Remaining Debt"}
                  </span>
                  <p className="text-lg font-black text-destructive">
                    {invoice.remaining.toFixed(2)} ل.س
                  </p>
                </div>

                <div className="flex justify-between items-center text-xs pt-2 border-t border-destructive/10">
                  <span className="text-muted-foreground">
                    {isArabic ? "الحالة" : "Status"}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold border bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse">
                    {isArabic ? "قيد المتابعة (مفتوح)" : "Open Debt"}
                  </span>
                </div>

                <Button
                  variant="destructive"
                  className="w-full h-10 text-xs font-bold gap-1.5 shadow-sm mt-1"
                >
                  <span>
                    {isArabic ? "فتح سجل ذمم المورد" : "Open Supplier Debt"}
                  </span>
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Card 5: Stock Added (يوضح حالة المخزن: مضاف فعلياً أو مسحوب للتراجع) */}
          <Card className="border-border bg-card shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                {isArabic ? "تأكيد كميات المخزون المضافة" : "Stock Status"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table className="text-[11px]">
                <TableHeader className="bg-muted/40">
                  <TableRow className="border-b border-border/70">
                    <TableHead
                      className={isArabic ? "text-right" : "text-left"}
                    >
                      {isArabic ? "البنت وباتش التشغيل" : "Batch Info"}
                    </TableHead>
                    <TableHead className="text-center">
                      {isArabic ? "الصلاحية" : "Expiry"}
                    </TableHead>
                    <TableHead
                      className={isArabic ? "text-left" : "text-right"}
                    >
                      {isArabic ? "الكمية" : "Qty"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items.map((item) => (
                    <TableRow
                      key={item.id}
                      className="border-b border-border/30 hover:bg-muted/5"
                    >
                      <TableCell className="text-start py-3">
                        <p className="font-semibold text-foreground">
                          {item.productName}
                        </p>
                        <p className="font-mono text-[9px] text-primary">
                          {item.batchNumber}
                        </p>
                      </TableCell>
                      <TableCell className="text-center font-mono text-muted-foreground">
                        {item.expiryDate}
                      </TableCell>
                      <TableCell
                        className={`font-extrabold ${isArabic ? "text-left" : "text-right"} ${isCompleted ? "text-emerald-500" : "text-destructive line-through"}`}
                      >
                        {isCompleted ? `+${item.qty}` : `0`}{" "}
                        {isArabic ? "وحدة" : "units"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
