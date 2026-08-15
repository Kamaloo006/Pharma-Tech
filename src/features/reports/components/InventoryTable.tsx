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
  isLoading: boolean;
}

export function InventoryTable({ products, isLoading }: InventoryTableProps) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
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
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20 overflow-hidden z-10">
          <div className="h-full bg-primary animate-pulse w-full" />
        </div>
      )}

      <CardHeader className="pb-4 border-b border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <Boxes className="h-4 w-4 text-primary" />
          {isArabic ? "المخزون حسب المنتج" : "Inventory by Product"}
        </CardTitle>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-48">
            <Search className="absolute left-2.5 rtl:right-2.5 rtl:left-auto top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isArabic ? "بحث..." : "Search..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 text-xs pl-8 rtl:pr-8 rtl:pl-2 rounded-xl"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-9 w-full sm:w-36 text-xs rounded-xl">
              <SelectValue
                placeholder={isArabic ? "جميع الفئات" : "Category"}
              />
            </SelectTrigger>
            <SelectContent dir={isArabic ? "rtl" : "ltr"}>
              <SelectItem value="all">
                {isArabic ? "جميع الفئات" : "All Categories"}
              </SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
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
                  className={`p-3 px-4 text-[11px] font-bold ${isArabic && "text-right"}`}
                >
                  {isArabic ? "المنتج" : "Product"}
                </TableHead>
                <TableHead className="p-3 px-4 text-[11px] font-bold text-center">
                  {isArabic ? "الكمية" : "Quantity"}
                </TableHead>
                <TableHead
                  className={`p-3 px-4 text-[11px] font-bold ${isArabic && "text-right"}`}
                >
                  {isArabic ? "قيمة التكلفة" : "Cost Value"}
                </TableHead>
                <TableHead
                  className={`p-3 px-4 text-[11px] font-bold ${isArabic && "text-right"}`}
                >
                  {isArabic ? "قيمة البيع" : "Selling Value"}
                </TableHead>
                <TableHead
                  className={`p-3 px-4 text-[11px] font-bold ${isArabic && "text-right"}`}
                >
                  {isArabic ? "الربح المحتمل" : "Potential Profit"}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="text-xs font-medium">
              {filteredProducts.length > 0 ? (
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
                      {formatCurrency(p.cost_value)} SYP
                    </TableCell>
                    <TableCell className="p-3 px-4 font-mono">
                      {formatCurrency(p.selling_value)} SYP
                    </TableCell>
                    <TableCell className="p-3 px-4 font-mono font-bold text-emerald-500">
                      {formatCurrency(p.potential_profit)} SYP
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="p-8 text-center text-muted-foreground text-xs"
                  >
                    {isArabic ? "لا توجد نتائج" : "No products found"}
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
