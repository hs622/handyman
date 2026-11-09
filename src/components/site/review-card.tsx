import { BadgeCheck } from "lucide-react";
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
      <Stars rating={review.rating} label={fill(dict.reviews.outOf, { rating: review.rating })} />
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
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success">
          <BadgeCheck className="size-3.5" /> {dict.review.verified}
        </span>
      </figcaption>
    </figure>
  );
}
