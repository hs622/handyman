import { pick, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/i18n/fill";
import { formatDate } from "@/lib/format";
import { Stars } from "./stars";

export type ReviewCardData = {
  id: number;
  rating: number;
  body: string;
  displayName: string;
  createdAt: Date;
  serviceName: string | null;
  serviceNameFr: string | null;
  device: string;
  sample?: boolean;
};

export function ReviewCard({
  review,
  lang,
  dict,
}: {
  review: ReviewCardData;
  lang: Locale;
  dict: Dictionary;
}) {
  const service = review.serviceName
    ? pick(review as { serviceName: string; serviceNameFr: string | null }, "serviceName", lang)
    : dict.review.repair;
  return (
    <figure className="flex h-full flex-col rounded-2xl border bg-card p-5 shadow-xs">
      <div className="flex items-center justify-between gap-2">
        <Stars rating={review.rating} label={fill(dict.reviews.outOf, { rating: review.rating })} />
        {review.sample && (
          <span className="rounded-full border border-dashed px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {dict.review.sample}
          </span>
        )}
      </div>
      <blockquote className="mt-3 flex-1 text-sm leading-relaxed">
        {lang === "fr" ? `« ${review.body} »` : `“${review.body}”`}
      </blockquote>
      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-4 text-sm">
        <div>
          <p className="font-semibold">{review.displayName}</p>
          <p className="text-xs text-muted-foreground">
            {service} · {review.device} · {formatDate(review.createdAt, lang)}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}
