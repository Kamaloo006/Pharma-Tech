import { Search, Loader2, Package, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { type Product } from "@/features/inventory/types/Product";

interface ProductSearchPOSProps {
  isArabic: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredProducts: Product[];
  onAddProduct: (product: Product) => void;
  isLoading?: boolean;
  isDebouncing?: boolean;
}

export function ProductSearchPOS({
  isArabic,
  searchQuery,
  setSearchQuery,
  filteredProducts,
  onAddProduct,
  isLoading = false,
  isDebouncing = false,
}: ProductSearchPOSProps) {
  const isSearching = isLoading || isDebouncing;
  const minSearchLength = 2;
  const isSearchValid = searchQuery.trim().length >= minSearchLength;

  return (
    <div className="relative space-y-2">
      <label className="text-xs font-bold text-muted-foreground flex items-center justify-between">
        <span>
          {isArabic
            ? "ابحث عن دواء / منتج بالاسم أو الـ Barcode"
            : "Search Product by Name or Barcode"}
        </span>
      </label>

      <div className="relative">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            isArabic ? "ابحث عن الدواء..." : "Search for a product..."
          }
          className="h-11 pr-10 pl-10 text-xs bg-background border-border rounded-xl focus-visible:ring-primary shadow-inner"
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          <Search className="h-4 w-4" />
        </div>
      </div>

      {searchQuery.trim() !== "" && (
        <div className="absolute right-0 left-0 top-18 z-50 bg-card border border-border rounded-xl shadow-2xl max-h-75 overflow-y-auto divide-y divide-border/40">
          {!isSearchValid ? (
            <div className="p-4 text-center text-xs text-muted-foreground">
              {isArabic
                ? "يرجى كتابة حرفين أو أكثر للبحث"
                : "Please enter 2 or more characters"}
            </div>
          ) : isSearching ? (
            <div className="p-6 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span>{isArabic ? "جاري البحث..." : "Searching..."}</span>
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => onAddProduct(product)}
                className="p-3 flex items-center justify-between hover:bg-muted/70 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Package className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-foreground group-hover:text-primary transition-colors">
                      {product.brand_name}
                    </h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {product.category?.name || "N/A"}
                      {product.strength && ` • ${product.strength}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-left">
                  <div className="text-right">
                    <span className="block text-xs font-mono font-bold text-foreground">
                      {(product.selling_price || 0).toFixed(2)} ل.س
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {isArabic ? "سعر البيع" : "Selling Price"}
                    </span>
                  </div>

                  <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-muted-foreground">
              {isArabic
                ? "لم يتم العثور على أي منتج مطابق للبحث"
                : "No matching products found"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
