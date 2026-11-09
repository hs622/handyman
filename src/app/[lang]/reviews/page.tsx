import type { Metadata } from "next";
import {
  MessageSquare,
  MessageSquareHeart,
  Phone,
  ShieldCheck,
  Stethoscope,
  Timer,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewCard } from "@/components/site/review-card";
import { Stars } from "@/components/site/stars";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { site } from "@/config/site";
import { localeTag } from "@/i18n/config";
import { fill } from "@/i18n/fill";
import { alternates } from "@/i18n/metadata";
import { getDictionary } from "@/i18n/server";
import { getPublishedReviews, getReviewSummary, onlySampleReviews } from "@/lib/catalog";

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
  const hasReviews = summary.count > 0;
  const stats = [
    { icon: Wrench, value: site.stats.devicesRepaired, label: dict.home.why.repaired },
    { icon: Timer, value: site.stats.sameDay, label: dict.home.why.sameDay },
    {
      icon: ShieldCheck,
      value: fill(dict.home.why.warrantyValue, { days: site.warrantyDays }),
      label: dict.home.why.warranty,
    },
    { icon: Stethoscope, value: t.freeValue, label: dict.service.freeDiagnosis },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.title}</h1>
      <p className="mt-1 text-muted-foreground">{t.intro}</p>
      {onlySampleReviews() && <p className="mt-1 text-xs text-muted-foreground italic">{t.sampleNote}</p>}

      <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
        <aside className="h-fit overflow-hidden rounded-3xl border bg-card shadow-xs lg:sticky lg:top-28">
          {/* Brand */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary to-[oklch(0.35_0.14_262)] p-6 text-primary-foreground">
            <Wrench
              aria-hidden
              strokeWidth={1.25}
              className="absolute -right-6 -bottom-8 size-36 opacity-15"
            />
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
              <Wrench className="size-6" />
            </span>
            <p className="mt-4 text-lg font-bold">{site.name}</p>
            <p className="mt-1 text-sm text-primary-foreground/80">{dict.meta.tagline}</p>
          </div>

          {/* Rating summary — only once there are real reviews */}
          {hasReviews && (
            <div className="border-b p-6">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                {t.ratingTitle}
              </p>
              <div className="mt-2 flex items-end gap-3">
                <p className="text-5xl leading-none font-extrabold">{average}</p>
                <div className="pb-1">
                  <Stars rating={summary.average} label={fill(t.outOf, { rating: average })} />
                  <p className="text-sm text-muted-foreground">
                    {summary.count === 1 ? t.countOne : fill(t.count, { count: summary.count })}
                  </p>
                </div>
              </div>
              <ul className="mt-5 space-y-2">
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
            </div>
          )}

          {/* Shop stats */}
          <div className="p-6">
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              {t.statsTitle}
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col rounded-2xl bg-muted/60 p-3">
                  <s.icon className="size-5 text-primary" aria-hidden />
                  <dt className="order-3 text-xs leading-snug text-muted-foreground">{s.label}</dt>
                  <dd className="order-2 mt-2 text-xl font-extrabold">{s.value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-5 text-sm font-medium">{t.cta}</p>
            <WhatsAppButton
              label={dict.common.whatsapp}
              message={dict.common.whatsappMessage}
              className="mt-2 w-full"
            />
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button asChild className="h-10 rounded-full">
                <a href={site.phoneHref}>
                  <Phone /> {dict.common.callUs}
                </a>
              </Button>
              <Button asChild variant="outline" className="h-10 rounded-full">
                <a href={site.smsHref}>
                  <MessageSquare /> {dict.common.textUs}
                </a>
              </Button>
            </div>
          </div>
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
