import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { Clock, MapPin, ShieldCheck, Stethoscope } from "lucide-react";
import { BookingForm } from "@/components/forms/booking-form";
import { HelpBox } from "@/components/site/help-box";
import { site } from "@/config/site";
import { fill } from "@/i18n/fill";
import { alternates } from "@/i18n/metadata";
import { getDictionary } from "@/i18n/server";
import { todayInShopTz } from "@/lib/format";
import { getActiveServices, getCategories } from "@/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { lang, dict } = await getDictionary();
  return {
    title: dict.book.metaTitle,
    description: dict.book.metaDescription,
    alternates: alternates(lang, "/book"),
  };
}

export default async function BookPage({ searchParams }: PageProps<"/[lang]/book">) {
  const { lang, dict } = await getDictionary();
  const t = dict.book;
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.title}</h1>
      <p className="mt-1 text-muted-foreground">{t.intro}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="relative rounded-3xl border bg-card p-5 sm:p-8">
          <Suspense fallback={<div className="h-[900px] animate-pulse rounded-2xl bg-muted" aria-busy />}>
            <BookingFormLoader searchParams={searchParams} />
          </Suspense>
        </div>
        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl border bg-card p-6">
            <p className="font-semibold">{t.next}</p>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex gap-3">
                <Stethoscope className="size-5 shrink-0 text-primary" />
                <span>{t.nextCall}</span>
              </li>
              <li className="flex gap-3">
                <ShieldCheck className="size-5 shrink-0 text-primary" />
                <span>{fill(t.nextQuote, { days: site.warrantyDays })}</span>
              </li>
              <li className="flex gap-3">
                <MapPin className="size-5 shrink-0 text-primary" />
                <span>{site.address}</span>
              </li>
              <li className="flex gap-3">
                <Clock className="size-5 shrink-0 text-primary" />
                <span>{site.hours[lang].map((h) => `${h.days} ${h.time}`).join(" · ")}</span>
              </li>
            </ul>
          </div>
          <HelpBox dict={dict} />
        </aside>
      </div>
    </div>
  );
}

async function BookingFormLoader({ searchParams }: Pick<PageProps<"/[lang]/book">, "searchParams">) {
  await connection();
  const { lang, dict } = await getDictionary();
  const { service: serviceSlug } = await searchParams;
  const [categories, services] = await Promise.all([getCategories(), getActiveServices()]);
  const initialServiceId = services.find((s) => s.slug === serviceSlug)?.id;
  return (
    <BookingForm
      lang={lang}
      dict={{ book: dict.book, errors: dict.errors, slot: dict.slot, common: dict.common }}
      categories={categories}
      services={services}
      initialServiceId={initialServiceId}
      minDate={todayInShopTz()}
    />
  );
}
