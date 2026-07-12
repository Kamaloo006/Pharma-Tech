import { useState } from "react";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDeleteProduct } from "../../hooks/UseProducts";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProductHeaderProps {
  product: any;
  isArabic: boolean;
  isOut: boolean;
  isLowStock: boolean;
  onEditClick: () => void;
  onNewStockClick: () => void;
}

export default function ProductHeader({
  product,
  isArabic,
  isOut,
  isLowStock,
  onEditClick,
}: ProductHeaderProps) {
  const navigate = useNavigate();
  const { mutate: deleteProduct, isPending } = useDeleteProduct();
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteProduct = () => {
    deleteProduct(product.id, {
      onSuccess: () => {
        toast.success(t("inventory.delete_modal.success"));
        setIsOpen(false);
      },
      onError: () => {
        toast.error(t("inventory.delete_modal.error"));
      },
    });
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border pb-6">
      <div className="flex items-start gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 bg-card hover:bg-accent text-muted-foreground hover:text-foreground rounded-xl border border-border transition-colors mt-1"
        >
          <ArrowLeft className={`h-4 w-4 ${isArabic ? "rotate-180" : ""}`} />
        </button>
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-card-foreground">
              {product.brand_name}
            </h1>
            <span className="text-lg font-medium text-muted-foreground">/</span>
            <h2 className="text-xl font-semibold text-muted-foreground">
              {product.ar_name}
            </h2>

            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border tracking-wide uppercase ${
                isOut
                  ? "border-red-500/30 bg-red-500/10 text-red-400"
                  : isLowStock
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              }`}
            >
              {isOut
                ? isArabic
                  ? "نفد"
                  : "Out of stock"
                : isLowStock
                  ? isArabic
                    ? "مخزون منخفض"
                    : "Low Stock"
                  : isArabic
                    ? "متوفر"
                    : "Available"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground font-medium">
            <span>{product.strength}</span>
            <span className="text-border">|</span>
            <span>{product.category?.name}</span>
            <span className="text-border">|</span>
            <span>{product.company?.name}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onEditClick}
          className="flex items-center gap-2 bg-card hover:bg-accent border border-border text-muted-foreground hover:text-foreground text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
        >
          <Edit2 className="h-3.5 w-3.5" />
          <span>{isArabic ? "تعديل المنتج" : "Edit Product"}</span>
        </button>

        {/* تطبيق الـ Alert Dialog هنا */}
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <button className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all">
              <Trash2 className="h-3.5 w-3.5" />
              <span>{isArabic ? "حذف" : "Delete"}</span>
            </button>
          </AlertDialogTrigger>

          <AlertDialogContent dir={isArabic ? "rtl" : "ltr"}>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {isArabic ? "هل أنت متأكد تماماً؟" : "Are you absolutely sure?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {isArabic
                  ? `سيتم حذف المنتج "${product.brand_name}" نهائياً من النظام ولا يمكن التراجع عن هذا الإجراء.`
                  : `This action cannot be undone. This will permanently delete the product "${product.brand_name}" from the system.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel className="cursor-pointer">
                {isArabic ? "إلغاء" : "Cancel"}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteProduct();
                }}
                disabled={isPending}
                className="bg-primary-600 hover:bg-primary-700 cursor-pointer text-white"
              >
                {isPending
                  ? isArabic
                    ? "جاري الحذف..."
                    : "Deleting..."
                  : isArabic
                    ? "تأكيد الحذف"
                    : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
