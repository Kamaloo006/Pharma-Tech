import { Skeleton } from "@/components/ui/skeleton";

export default function ProductHeaderCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 flex flex-col md:flex-row justify-between gap-4 shadow-sm">
      <div className="space-y-3 flex-1">
        <Skeleton className="h-6 w-1/3 bg-muted/60 rounded-lg" />
        <Skeleton className="h-4 w-1/4 bg-muted/40 rounded-lg" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-5 w-16 bg-muted/40 rounded-md" />
          <Skeleton className="h-5 w-20 bg-muted/40 rounded-md" />
        </div>
      </div>
      <div className="flex gap-2 items-center md:self-end">
        <Skeleton className="h-10 w-28 bg-muted/60 rounded-xl" />
      </div>
    </div>
  );
}
