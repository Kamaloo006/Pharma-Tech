import { Skeleton } from "@/components/ui/skeleton";

export default function InventoryCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
      <Skeleton className="h-4 w-1/2 bg-muted/60 rounded-md" />
      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="h-14 bg-muted/40 rounded-xl" />
        <Skeleton className="h-14 bg-muted/40 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-full bg-muted/40 rounded-xl" />
    </div>
  );
}
