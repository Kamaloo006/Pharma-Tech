import { Skeleton } from "@/components/ui/skeleton";

export default function TableCardSkeleton({ title }: { title: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
      <div className="text-xs font-semibold text-muted-foreground">{title}</div>
      <div className="space-y-2.5">
        <Skeleton className="h-8 w-full bg-muted/60 rounded-lg" />
        <Skeleton className="h-10 w-full bg-muted/30 rounded-lg" />
        <Skeleton className="h-10 w-full bg-muted/30 rounded-lg" />
        <Skeleton className="h-10 w-full bg-muted/30 rounded-lg" />
      </div>
    </div>
  );
}
