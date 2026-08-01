import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CustomerSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function CustomerSearch({
  searchTerm,
  onSearchChange,
}: CustomerSearchProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:right-3 rtl:left-auto" />
        <Input
          type="text"
          placeholder={t("customers.searchPlaceholder", "Search customers...")}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 rtl:pr-9 rtl:pl-3 h-9 text-xs bg-card border-border/60"
        />
      </div>
    </div>
  );
}
