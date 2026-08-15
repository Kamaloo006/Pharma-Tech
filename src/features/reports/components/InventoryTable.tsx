import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Boxes } from "lucide-react";

interface InventoryProduct {
  product_id: string | number;
  ar_name: string;
  brand_name: string;
  category?: string;
  total_quantity: number;
  cost_value: number;
  selling_value: number;
  potential_profit: number;
}

interface InventoryTableProps {
  products: InventoryProduct[];
  isLoading?: boolean;
}

export function InventoryTable({
  products = [],
  isLoading = false,
}: InventoryTableProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const cats = new Set<string>();

    (products || []).forEach((p) => {
      if (p.category) cats.add(p.category);
    });

    return Array.from(cats);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return (products || []).filter((product) => {
      const name = isArabic ? product.ar_name : product.brand_name;

      const matchesSearch = name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory, isArabic]);

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;

    return val.toLocaleString();
  };

  return (
    <Card
      data-aos="fade-up"
      className="border-border shadow-xs rounded-2xl relative overflow-hidden"
    >
      <CardHeader className="pb-4 border-b border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <Boxes className="h-4 w-4 text-primary" />
          {t("inventory.inventoryByProduct")}
        </CardTitle>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-48">
            <Search className="absolute left-2.5 rtl:right-2.5 rtl:left-auto top-2.5 h-4 w-4 text-muted-foreground" />

            <Input
              placeholder={t("common.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 text-xs pl-8 rtl:pr-8 rtl:pl-2 rounded-xl"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-9 w-full sm:w-36 text-xs rounded-xl">
              <SelectValue placeholder={t("inventory.allCategories")} />
            </SelectTrigger>

            <SelectContent className="bg-muted" dir={isArabic ? "rtl" : "ltr"}>
              <SelectItem className="hover:bg-primary/70" value="all">
                {t("inventory.allCategories")}
              </SelectItem>

              {categories.map((cat) => (
                <SelectItem
                  key={cat}
                  value={cat}
                  className="hover:bg-primary/70"
                >
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="max-h-71.25 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
          <Table>
            <TableHeader className="bg-muted/80 backdrop-blur-xs sticky top-0 z-10 border-b border-border/40">
              <TableRow className="hover:bg-transparent">
                <TableHead
                  className={`p-3 px-4 text-[11px] font-bold ${
                    isArabic ? "text-right" : ""
                  }`}
                >
                  {t("inventory.product")}
                </TableHead>

                <TableHead className="p-3 px-4 text-[11px] font-bold text-center">
                  {t("inventory.quantity")}
                </TableHead>

                <TableHead
                  className={`p-3 px-4 text-[11px] font-bold ${
                    isArabic ? "text-right" : ""
                  }`}
                >
                  {t("inventory.costValue")}
                </TableHead>

                <TableHead
                  className={`p-3 px-4 text-[11px] font-bold ${
                    isArabic ? "text-right" : ""
                  }`}
                >
                  {t("inventory.sellingValue")}
                </TableHead>

                <TableHead
                  className={`p-3 px-4 text-[11px] font-bold ${
                    isArabic ? "text-right" : ""
                  }`}
                >
                  {t("inventory.potentialProfit")}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="text-xs font-medium">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx} className="border-b border-border/30">
                    <TableCell className="p-3 px-4">
                      <Skeleton className="h-4 w-32 mb-1 bg-muted-foreground/20 animate-pulse" />
                      <Skeleton className="h-3 w-16 bg-muted-foreground/20 animate-pulse" />
                    </TableCell>

                    <TableCell className="p-3 px-4 text-center">
                      <Skeleton className="h-4 w-12 mx-auto bg-muted-foreground/20 animate-pulse" />
                    </TableCell>

                    <TableCell className="p-3 px-4">
                      <Skeleton className="h-4 w-20 bg-muted-foreground/20 animate-pulse" />
                    </TableCell>

                    <TableCell className="p-3 px-4">
                      <Skeleton className="h-4 w-20 bg-muted-foreground/20 animate-pulse" />
                    </TableCell>

                    <TableCell className="p-3 px-4">
                      <Skeleton className="h-4 w-24 bg-muted-foreground/20 animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <TableRow
                    key={p.product_id}
                    className="hover:bg-muted/20 transition-colors border-b border-border/30"
                  >
                    <TableCell className="p-3 px-4 font-semibold">
                      {isArabic ? p.ar_name : p.brand_name}

                      {p.category && (
                        <span className="block text-[10px] text-muted-foreground font-normal">
                          {p.category}
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="p-3 px-4 font-mono text-center">
                      {p.total_quantity.toLocaleString()}
                    </TableCell>

                    <TableCell className="p-3 px-4 font-mono">
                      {formatCurrency(p.cost_value)} {t("common.syp")}
                    </TableCell>

                    <TableCell className="p-3 px-4 font-mono">
                      {formatCurrency(p.selling_value)} {t("common.syp")}
                    </TableCell>

                    <TableCell className="p-3 px-4 font-mono font-bold text-emerald-500">
                      {formatCurrency(p.potential_profit)} {t("common.syp")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="p-8 text-center text-muted-foreground text-xs"
                  >
                    {t("common.noResults")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
