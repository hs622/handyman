import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CheckCircle2, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyCode } from "@/components/site/copy-code";
import { site } from "@/config/site";
import { localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/server";
import { normalizeBookingCode } from "@/lib/booking-code";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return { title: dict.success.metaTitle, robots: { index: false } };
}

export default async function BookingSuccessPage({ searchParams }: PageProps<"/[lang]/book/success">) {
  const { lang, dict } = await getDictionary();
  const t = dict.success;
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-3xl border bg-card p-6 text-center sm:p-10">
        <CheckCircle2 className="mx-auto size-14 text-success" />
        <h1 className="mt-4 text-2xl font-bold sm:text-3xl">{t.title}</h1>
        <p className="mt-2 text-muted-foreground">{t.text}</p>
        <Suspense
          fallback={<div className="mx-auto mt-6 h-24 max-w-xs animate-pulse rounded-2xl bg-muted" />}
        >
          <BookingCode searchParams={searchParams} />
        </Suspense>
        <div className="mt-8 grid gap-3 text-left text-sm sm:grid-cols-2">
          <a
            href={site.mapHref}
            target="_blank"
            rel="noreferrer"
            className="flex gap-3 rounded-2xl bg-muted/60 p-4"
          >
            <MapPin className="size-5 shrink-0 text-primary" />
            <span>
              <span className="block font-semibold">{t.dropoff}</span>
              {site.address}
            </span>
          </a>
          <div className="flex gap-3 rounded-2xl bg-muted/60 p-4">
            <Clock className="size-5 shrink-0 text-primary" />
            <span>
              <span className="block font-semibold">{t.hours}</span>
              {site.hours[lang].map((h) => (
                <span key={h.days} className="block">
                  {h.days} {h.time}
                </span>
              ))}
            </span>
          </div>
        </div>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild className="h-11 rounded-full px-6">
            <Link href={localePath(lang, "/track")}>{t.track}</Link>
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-full px-6">
            <Link href={localePath(lang)}>{t.home}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

async function BookingCode({ searchParams }: Pick<PageProps<"/[lang]/book/success">, "searchParams">) {
  const { dict } = await getDictionary();
  const t = dict.success;
  const { code } = await searchParams;
  if (typeof code !== "string") return null;
  const normalized = normalizeBookingCode(code);
  return (
    <div className="mx-auto mt-6 max-w-xs rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 p-5">
      <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">{t.code}</p>
      <p className="mt-1 font-mono text-3xl font-bold tracking-wider">{normalized}</p>
      <CopyCode code={normalized} label={t.copy} copied={t.copied} />
      <p className="mt-2 text-xs text-muted-foreground">{t.save}</p>
    </div>
  );
}
