import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  AdjustmentType,
  ProductSummary,
} from "@/features/inventory/types/Stock";
import {
  useProductBatches,
  useCreateStockAdjustment,
} from "@/features/inventory/hooks/useStockAdjustments";

interface AdjustStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  product?: ProductSummary;
}

export default function AdjustStockModal({
  isOpen,
  onClose,
  productId,
  product,
}: AdjustStockModalProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  // Form States
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType>("add");
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [purchasePrice, setPurchasePrice] = useState<string>("");
  const [sellingPrice, setSellingPrice] = useState<string>("");
  const [batchNumber, setBatchNumber] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const today = new Date().toISOString().split("T")[0];

  const [validationError, setValidationError] = useState<string | null>(null);

  // Queries & Mutations
  const { data: batches = [], isLoading: isLoadingBatches } = useProductBatches(
    productId,
    isOpen && adjustmentType === "remove",
  );

  const createAdjustment = useCreateStockAdjustment();

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setAdjustmentType("add");
    setSelectedBatchId("");
    setQuantity("");
    setPurchasePrice("");
    setSellingPrice("");
    setBatchNumber("");
    setExpiryDate("");
    setNotes("");
    setValidationError(null);
  };

  const selectedBatch = batches.find(
    (b) => b.id.toString() === selectedBatchId,
  );
  const availableQuantity = selectedBatch?.quantity_on_hand ?? 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const parsedQty = parseFloat(quantity);
    if (!parsedQty || parsedQty <= 0) {
      setValidationError(
        t("inventory.stock_adjustment.validation.invalid_quantity"),
      );
      return;
    }

    if (adjustmentType === "remove") {
      if (!selectedBatchId) {
        setValidationError(
          t("inventory.stock_adjustment.validation.select_batch"),
        );
        return;
      }
      if (parsedQty > availableQuantity) {
        setValidationError(
          t("inventory.stock_adjustment.validation.quantity_exceeds", {
            available: availableQuantity,
          }),
        );
        return;
      }

      createAdjustment.mutate(
        {
          adjustment_type: "remove",
          product_id: productId,
          batch_id: parseInt(selectedBatchId, 10),
          quantity: parsedQty,
          notes: notes.trim() || undefined,
        },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    } else {
      createAdjustment.mutate(
        {
          adjustment_type: "add",
          product_id: productId,
          quantity: parsedQty,
          purchase_price: purchasePrice ? parseFloat(purchasePrice) : undefined,
          selling_price: sellingPrice ? parseFloat(sellingPrice) : undefined,
          batch_number: batchNumber.trim() || undefined,
          expiry_date: expiryDate || undefined,
          notes: notes.trim() || undefined,
        },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !createAdjustment.isPending && onClose()}
    >
      <DialogContent
        className="sm:max-w-md bg-background border border-border rounded-2xl px-6 py-4 shadow-2xl gap-y-4"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <DialogHeader className="border-b border-border pb-3 flex justify-between items-center">
          <DialogTitle className="text-sm font-bold text-foreground">
            {t("inventory.stock_adjustment.title")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Product Header Info */}
          {product && (
            <div className="bg-muted/50 p-3 rounded-xl border border-border space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                {t("inventory.stock_adjustment.product")}
              </span>
              <p className="font-semibold text-foreground">{product.name}</p>
            </div>
          )}

          {/* Adjustment Type Selection */}
          <div className="space-y-1.5 text-start">
            <label className="text-muted-foreground font-medium">
              {t("inventory.stock_adjustment.adjustment_type")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={adjustmentType === "add" ? "default" : "outline"}
                className={`h-9 rounded-xl text-xs font-semibold ${
                  adjustmentType === "add"
                    ? "bg-emerald-500 hover:bg-emerald-600 text-zinc-950"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
                onClick={() => {
                  setAdjustmentType("add");
                  setValidationError(null);
                }}
              >
                {t("inventory.stock_adjustment.add_stock")}
              </Button>

              <Button
                type="button"
                variant={adjustmentType === "remove" ? "default" : "outline"}
                className={`h-9 rounded-xl text-xs font-semibold ${
                  adjustmentType === "remove"
                    ? "bg-rose-500 hover:bg-rose-600 text-white"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
                onClick={() => {
                  setAdjustmentType("remove");
                  setValidationError(null);
                }}
              >
                {t("inventory.stock_adjustment.remove_stock")}
              </Button>
            </div>
          </div>

          {/* Form Fields: Remove Stock Mode */}
          {adjustmentType === "remove" ? (
            <>
              <div className="space-y-1.5 text-start">
                <label className="text-muted-foreground font-medium">
                  {t("inventory.stock_adjustment.batch")}
                </label>
                <Select
                  value={selectedBatchId}
                  onValueChange={(val) => {
                    setSelectedBatchId(val);
                    setValidationError(null);
                  }}
                  disabled={isLoadingBatches}
                >
                  <SelectTrigger className="w-full bg-muted border-border rounded-xl h-10 text-xs focus:ring-1 focus:ring-emerald-500">
                    <SelectValue
                      placeholder={
                        isLoadingBatches
                          ? t("inventory.stock_adjustment.loading_batches")
                          : t(
                              "inventory.stock_adjustment.select_batch_placeholder",
                            )
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-muted border-border">
                    {batches.map((b) => (
                      <SelectItem
                        key={b.id}
                        value={b.id.toString()}
                        className="text-xs focus:bg-primary/70 cursor-pointer"
                      >
                        {b.batch_number} — ({b.quantity_on_hand}{" "}
                        {t("inventory.stock_adjustment.units")})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedBatch && (
                <div className="flex justify-between items-center bg-muted/30 px-3 py-2 rounded-lg border border-border/50 text-xs">
                  <span className="text-muted-foreground">
                    {t("inventory.stock_adjustment.available_quantity")}
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    {availableQuantity} {t("inventory.stock_adjustment.units")}
                  </span>
                </div>
              )}

              <div className="space-y-1.5 text-start">
                <label className="text-muted-foreground font-medium">
                  {t("inventory.stock_adjustment.quantity_to_remove")}
                </label>
                <Input
                  type="number"
                  min="1"
                  max={availableQuantity || undefined}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 5"
                  className="w-full bg-muted border-border rounded-xl h-10 font-mono text-xs focus-visible:ring-1 focus-visible:ring-emerald-500"
                />
              </div>
            </>
          ) : (
            /* Form Fields: Add Stock Mode */
            <>
              <div className="space-y-1.5 text-start">
                <label className="text-muted-foreground font-medium">
                  {t("inventory.stock_adjustment.quantity")}
                </label>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full bg-muted border-border rounded-xl h-10 font-mono text-xs focus-visible:ring-1 focus-visible:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5 text-start">
                  <label className="text-muted-foreground font-medium">
                    {t("inventory.stock_adjustment.purchase_price")}
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-muted border-border rounded-xl h-10 font-mono text-xs focus-visible:ring-1 focus-visible:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1.5 text-start">
                  <label className="text-muted-foreground font-medium">
                    {t("inventory.stock_adjustment.selling_price")}
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-muted border-border rounded-xl h-10 font-mono text-xs focus-visible:ring-1 focus-visible:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5 text-start">
                  <label className="text-muted-foreground font-medium">
                    {t("inventory.stock_adjustment.batch_number")}
                  </label>
                  <Input
                    type="text"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    placeholder="ADJ-001"
                    className="w-full bg-muted border-border rounded-xl h-10 font-mono text-xs focus-visible:ring-1 focus-visible:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1.5 text-start">
                  <label className="text-muted-foreground font-medium">
                    {t("inventory.stock_adjustment.expiry_date")}
                  </label>
                  <Input
                    type="date"
                    value={expiryDate}
                    min={today}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-muted border-border rounded-xl h-10 text-xs focus-visible:ring-1 focus-visible:ring-emerald-500"
                  />
                </div>
              </div>
            </>
          )}

          {/* Reason / Notes Field */}
          <div className="space-y-1.5 text-start">
            <label className="text-muted-foreground font-medium">
              {t("inventory.stock_adjustment.notes_reason")}
            </label>
            <Textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-muted border-border rounded-xl resize-none text-xs focus-visible:ring-1 focus-visible:ring-emerald-500"
            />
          </div>

          {/* Validation & API Error Feedback */}
          {(validationError || createAdjustment.isError) && (
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs text-start">
              {validationError ||
                (createAdjustment.error as any)?.response?.data?.message ||
                t("inventory.stock_adjustment.error_posting")}
            </div>
          )}

          <DialogFooter className="flex items-center sm:justify-end gap-2 pt-3 border-t border-border mt-2">
            <Button
              type="button"
              variant="outline"
              disabled={createAdjustment.isPending}
              onClick={onClose}
              className="rounded-xl border-border hover:bg-muted text-muted-foreground text-xs font-medium px-4 h-9"
            >
              {t("inventory.stock_adjustment.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={createAdjustment.isPending}
              className={`rounded-xl font-bold text-xs px-4 h-9 shadow-md flex items-center gap-1.5 ${
                adjustmentType === "add"
                  ? "bg-emerald-500 hover:bg-emerald-600 text-zinc-950"
                  : "bg-rose-500 hover:bg-rose-600 text-white"
              }`}
            >
              {createAdjustment.isPending && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              {createAdjustment.isPending
                ? t("inventory.stock_adjustment.posting")
                : adjustmentType === "add"
                  ? t("inventory.stock_adjustment.add_stock_btn")
                  : t("inventory.stock_adjustment.remove_stock_btn")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
