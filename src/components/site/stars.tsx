import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({ rating, label, className }: { rating: number; label: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} role="img" aria-label={label}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          aria-hidden
          className={cn(
            "size-4",
            i <= Math.round(rating) ? "fill-accent text-accent" : "fill-muted text-muted-foreground/30",
          )}
        />
      ))}
    </span>
  );
}
