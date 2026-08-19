import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, Loader2, Plus } from "lucide-react";
import type { Product } from "@/features/inventory/types/Product";

interface ProductSearchPopoverProps {
  isArabic: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isSearchingProducts: boolean;
  filteredProducts: Product[];
  onAddProduct: (product: Product) => void;
}

export function ProductSearchPopover({
  isArabic,
  searchQuery,
  setSearchQuery,
  isOpen,
  setIsOpen,
  isSearchingProducts,
  filteredProducts,
  onAddProduct,
}: ProductSearchPopoverProps) {
  return (
    <Popover
      open={isOpen && searchQuery.trim().length >= 2}
      onOpenChange={setIsOpen}
    >
      <PopoverTrigger asChild>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={
              isArabic
                ? "ابحث عن منتج بالاسم أو الباركود..."
                : "Search product by name or barcode..."
            }
            value={searchQuery}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            className="h-10 pl-9 pr-4 text-xs rounded-xl bg-background border-input font-medium"
          />
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-2 bg-background border-border shadow-lg rounded-xl mt-1"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="max-h-64 overflow-y-auto space-y-1">
          {isSearchingProducts ? (
            <div className="flex items-center justify-center p-6 text-xs text-muted-foreground gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>
                {isArabic ? "جاري البحث..." : "Searching products..."}
              </span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground font-medium">
              {isArabic
                ? `لم يتم العثور على نتائج لـ "${searchQuery}"`
                : `No products found matching "${searchQuery}"`}
            </div>
          ) : (
            filteredProducts.map((product) => {
              const totalQty = product.total_quantity ?? 0;
              const isOutOfStock = totalQty <= 0;
              return (
                <div
                  key={product.id}
                  onClick={() => {
                    if (!isOutOfStock) {
                      onAddProduct(product);
                      setIsOpen(false);
                    }
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-lg text-xs transition-colors group ${
                    isOutOfStock
                      ? "opacity-50 cursor-not-allowed bg-muted/20"
                      : "hover:bg-muted/60 cursor-pointer"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-foreground group-hover:text-primary transition-colors">
                      {product.brand_name || product.ar_name}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      {product.strength || ""}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      {product.barcode}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div className="space-y-0.5">
                      <div className="font-mono font-bold text-foreground">
                        {Number(product.selling_price || 0).toLocaleString()}{" "}
                        SYP
                      </div>
                      <div
                        className={`text-[10px] ${
                          isOutOfStock
                            ? "text-destructive font-bold"
                            : "text-muted-foreground"
                        }`}
                      >
                        {isOutOfStock
                          ? isArabic
                            ? "نفذت الكمية"
                            : "Out of Stock"
                          : `${isArabic ? "المخزون" : "Stock"}: ${totalQty}`}
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      disabled={isOutOfStock}
                      className="h-7 w-7 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
