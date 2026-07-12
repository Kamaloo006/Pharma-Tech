// components/productDetails/StockMovementsCard.tsx
import { History, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { type StockMovement } from "../../types/StockMovement";

interface StockMovementsCardProps {
  movements: StockMovement[];
  isArabic: boolean;
}

export default function StockMovementsCard({
  movements,
  isArabic,
}: StockMovementsCardProps) {
  // دالة لتنسيق نوع الحركة
  const getMovementBadge = (type: StockMovement["movement_type"]) => {
    const config = {
      purchase_in: {
        label: isArabic ? "شراء (وارد)" : "Purchase In",
        styles: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      },
      sale_out: {
        label: isArabic ? "بيع (صادر)" : "Sale Out",
        styles: "bg-red-500/10 text-red-400 border-red-500/20",
      },
      adjustment_in: {
        label: isArabic ? "تسوية (+) وارد" : "Adjustment In",
        styles: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      },
      adjustment_out: {
        label: isArabic ? "تسوية (-) صادر" : "Adjustment Out",
        styles: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      },
      expiry_out: {
        label: isArabic ? "إتلاف منتهي" : "Expiry Out",
        styles: "bg-rose-950/40 text-rose-300 border-rose-900/30",
      },
    };
    return (
      config[type] || { label: type, styles: "bg-muted text-muted-foreground" }
    );
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <History className="h-4 w-4 text-emerald-500" />
        <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          {isArabic ? "سجل حركة المخزون (Log)" : "STOCK MOVEMENTS LOG"}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table
          className="w-full text-left border-collapse"
          dir={isArabic ? "rtl" : "ltr"}
        >
          <thead>
            <tr className="border-b border-border/60 text-[10px] uppercase font-bold text-muted-foreground bg-muted/30">
              <th className="py-2 px-3 text-center">
                {isArabic ? "التاريخ" : "Date"}
              </th>
              <th className="py-2 px-3">{isArabic ? "النوع" : "Type"}</th>
              <th className="py-2 px-3 text-center">
                {isArabic ? "الكمية" : "Quantity"}
              </th>
              <th className="py-2 px-3">{isArabic ? "التشغيلة" : "Batch"}</th>
              <th className="py-2 px-3">{isArabic ? "المرجع" : "Reference"}</th>
              <th className="py-2 px-3">{isArabic ? "بواسطة" : "User"}</th>
            </tr>
          </thead>
          <tbody className="text-xs divide-y divide-border/40">
            {movements.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-muted-foreground italic"
                >
                  {isArabic
                    ? "لا توجد حركات مخزنية مسجلة"
                    : "No stock movements recorded yet."}
                </td>
              </tr>
            ) : (
              movements.map((move) => {
                const badge = getMovementBadge(move.movement_type);
                const isPositive = move.quantity_change > 0;
                const formattedDate = new Date(
                  move.created_at,
                ).toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                });

                return (
                  <tr
                    key={move.id}
                    className="hover:bg-muted/10 transition-colors"
                  >
                    <td className="py-2.5 px-3 text-center font-mono text-muted-foreground whitespace-nowrap">
                      {formattedDate}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-md border text-[10px] font-medium ${badge.styles}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td
                      className={`py-2.5 px-3 text-center font-bold font-mono whitespace-nowrap`}
                    >
                      <span className="flex items-center justify-center gap-0.5">
                        {isPositive ? (
                          <ArrowUpRight className="h-3 w-3 text-emerald-400 inline" />
                        ) : (
                          <ArrowDownLeft className="h-3 w-3 text-red-400 inline" />
                        )}
                        <span
                          className={
                            isPositive ? "text-emerald-400" : "text-red-400"
                          }
                        >
                          {isPositive
                            ? `+${move.quantity_change}`
                            : move.quantity_change}
                        </span>
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-foreground font-semibold">
                      {move.batch?.batch_number || "—"}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground font-medium">
                      <span className="capitalize">
                        {move.reference_type?.replace("_", " ")}
                      </span>{" "}
                      #{move.reference_id}
                    </td>
                    <td className="py-2.5 px-3 text-foreground font-medium">
                      {move.created_by
                        ? `${move.created_by.first_name} ${move.created_by.last_name}`
                        : "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
