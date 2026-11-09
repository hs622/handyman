import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { localePath, pick, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatMoney } from "@/lib/format";
import type { ServiceWithCategory } from "@/lib/queries";
import { CategoryIcon } from "./category-icon";

export function ServiceCard({
  service,
  lang,
  dict,
}: {
  service: ServiceWithCategory;
  lang: Locale;
  dict: Dictionary;
}) {
  return (
    <Link
      href={localePath(lang, `/services/${service.slug}`)}
      className="group flex h-full flex-col rounded-2xl border bg-card p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="inline-flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
          <CategoryIcon name={service.categoryIcon} className="size-5" />
        </span>
        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          {pick(service, "categoryName", lang)}
        </span>
      </div>
      <h3 className="font-semibold">{pick(service, "name", lang)}</h3>
      <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted-foreground">
        {pick(service, "description", lang)}
      </p>
      <div className="mt-4 flex items-center justify-between gap-2 border-t pt-4 text-sm">
        <div>
          <span className="text-muted-foreground">{dict.common.from} </span>
          <span className="font-semibold">
            {formatMoney(service.priceFromCents, lang, { compact: true })}
          </span>
        </div>
        <span className="inline-flex items-center gap-1 text-right text-muted-foreground">
          <Clock className="size-3.5 shrink-0" /> {pick(service, "turnaround", lang)}
        </span>
      </div>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
        {dict.common.viewAndBook} <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
