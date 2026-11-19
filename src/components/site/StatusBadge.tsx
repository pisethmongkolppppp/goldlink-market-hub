import { cn } from "@/lib/utils";

export function StatusBadge({
  children = "Live data not connected",
  tone = "pending",
  className,
}: {
  children?: React.ReactNode;
  tone?: "pending" | "demo" | "sample";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        tone === "pending" && "border-border bg-muted/60 text-muted-foreground",
        tone === "demo" && "border-primary/40 bg-primary/10 text-primary",
        tone === "sample" && "border-chart-eth/40 bg-chart-eth/10 text-chart-eth",
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          tone === "pending" && "bg-muted-foreground",
          tone === "demo" && "bg-primary",
          tone === "sample" && "bg-chart-eth",
        )}
        aria-hidden
      />
      {children}
    </span>
  );
}
