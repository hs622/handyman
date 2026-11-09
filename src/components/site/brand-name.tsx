import { site } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * "Fixora Concept" logo text: bold main word, with the suffix smaller and lighter.
 */
export function BrandName({ className, suffixClassName }: { className?: string; suffixClassName?: string }) {
  return (
    <span className={cn("inline-flex items-baseline gap-1 font-bold tracking-tight", className)}>
      {site.brand.main}
      <span className={cn("text-[0.72em] font-normal tracking-normal opacity-60", suffixClassName)}>
        {site.brand.suffix}
      </span>
    </span>
  );
}
