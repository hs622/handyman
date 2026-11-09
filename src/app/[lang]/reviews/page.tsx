import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquareHeart } from "lucide-react";
import { ReviewCard } from "@/components/site/review-card";
import { Stars } from "@/components/site/stars";
import { localePath, localeTag } from "@/i18n/config";
import { fill } from "@/i18n/fill";
import { alternates } from "@/i18n/metadata";
import { getDictionary } from "@/i18n/server";
import { getPublishedReviews, getReviewSummary } from "@/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { lang, dict } = await getDictionary();
  return {
    title: dict.reviews.metaTitle,
    description: dict.reviews.metaDescription,
    alternates: alternates(lang, "/reviews"),
  };
}

export default async function ReviewsPage() {
  const { lang, dict } = await getDictionary();
  const t = dict.reviews;
  const [summary, reviews] = await Promise.all([getReviewSummary(), getPublishedReviews(100)]);
  const max = Math.max(1, ...summary.distribution.map((d) => d.count));
  const average = summary.average.toLocaleString(localeTag[lang], {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.title}</h1>
      <p className="mt-1 text-muted-foreground">{t.intro}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
        <aside className="h-fit rounded-3xl border bg-card p-6 lg:sticky lg:top-28">
          <p className="text-5xl font-extrabold">{summary.count ? average : "—"}</p>
          <Stars rating={summary.average} label={fill(t.outOf, { rating: average })} className="mt-2" />
          <p className="mt-1 text-sm text-muted-foreground">
            {summary.count === 1 ? t.countOne : fill(t.count, { count: summary.count })}
          </p>
          <ul className="mt-6 space-y-2">
            {summary.distribution.map((d) => (
              <li key={d.rating} className="flex items-center gap-3 text-sm">
                <span className="w-3 text-muted-foreground">{d.rating}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <span
                    className="block h-full rounded-full bg-accent"
                    style={{ width: `${(d.count / max) * 100}%` }}
                  />
                </span>
                <span className="w-6 text-right text-muted-foreground tabular-nums">{d.count}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 rounded-2xl bg-muted/60 p-4 text-sm text-muted-foreground">
            {t.hadRepair}{" "}
            <Link href={localePath(lang, "/track")} className="font-medium text-primary">
              {t.trackLink}
            </Link>{" "}
            {t.toReview}
          </p>
        </aside>

        {reviews.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((r) => (
              <ReviewCard key={r.id} review={r} lang={lang} dict={dict} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed bg-card p-16 text-center">
            <MessageSquareHeart className="size-10 text-muted-foreground" />
            <p className="mt-3 font-semibold">{t.noneTitle}</p>
            <p className="text-sm text-muted-foreground">{t.noneText}</p>
          </div>
        )}
      </div>
    </div>
  );
}
