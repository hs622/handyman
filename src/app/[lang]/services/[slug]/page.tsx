import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, BadgeCheck, Clock, MessageSquare, Phone, ShieldCheck, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryIcon } from "@/components/site/category-icon";
import { HelpBox } from "@/components/site/help-box";
import { ServiceCard } from "@/components/site/service-card";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { site } from "@/config/site";
import { localePath, pick } from "@/i18n/config";
import { fill } from "@/i18n/fill";
import { alternates } from "@/i18n/metadata";
import { getDictionary } from "@/i18n/server";
import { formatMoney, taxLabel } from "@/lib/format";
import { getActiveServices, getServiceBySlug } from "@/lib/catalog";

export async function generateStaticParams() {
  const services = await getActiveServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/services/[slug]">): Promise<Metadata> {
  const { lang, dict } = await getDictionary();
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: dict.service.notFound };
  return {
    title: `${pick(service, "name", lang)} — ${pick(service, "categoryName", lang)}`,
    description: `${pick(service, "description", lang)} ${dict.common.startingFrom} ${formatMoney(service.priceFromCents, lang)}.`,
    alternates: alternates(lang, `/services/${slug}`),
  };
}

export default function ServicePage({ params }: PageProps<"/[lang]/services/[slug]">) {
  return (
    <Suspense fallback={<ServiceSkeleton />}>
      <ServiceDetail params={params} />
    </Suspense>
  );
}

function ServiceSkeleton() {
  return (
    <div aria-busy className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1fr_360px]">
      <div className="h-[420px] animate-pulse rounded-3xl bg-muted" />
      <div className="h-64 animate-pulse rounded-3xl bg-muted" />
    </div>
  );
}

async function ServiceDetail({ params }: Pick<PageProps<"/[lang]/services/[slug]">, "params">) {
  const { lang, dict } = await getDictionary();
  const t = dict.service;
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const categoryName = pick(service, "categoryName", lang);
  const related = (await getActiveServices())
    .filter((s) => s.categoryId === service.categoryId && s.id !== service.id)
    .slice(0, 3);
  const tax = taxLabel(lang, dict.common.taxName);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link
        href={localePath(lang, `/services?category=${service.categorySlug}`)}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> {fill(t.backTo, { category: categoryName })}
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_360px]">
        <article className="rounded-3xl border bg-card p-6 sm:p-8">
          <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-secondary text-primary">
            <CategoryIcon name={service.categoryIcon} className="size-7" />
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight">{pick(service, "name", lang)}</h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground">{categoryName}</p>
          <p className="mt-5 text-lg leading-relaxed">{pick(service, "description", lang)}</p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              { icon: Stethoscope, title: t.freeDiagnosis, text: t.freeDiagnosisText },
              { icon: BadgeCheck, title: t.qualityParts, text: t.qualityPartsText },
              {
                icon: ShieldCheck,
                title: fill(t.warranty, { days: site.warrantyDays }),
                text: t.warrantyText,
              },
              { icon: Clock, title: pick(service, "turnaround", lang), text: t.turnaroundText },
            ].map((f) => (
              <li key={f.title} className="flex gap-3 rounded-2xl bg-muted/60 p-4">
                <f.icon className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold">{f.title}</p>
                  <p className="text-sm text-muted-foreground">{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl border bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">{dict.common.startingFrom}</p>
            <p className="text-3xl font-extrabold">
              {formatMoney(service.priceFromCents, lang)}{" "}
              <span className="text-base font-medium text-muted-foreground">
                {fill(dict.common.plusTax, { tax: dict.common.taxName })}
              </span>
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="size-4" /> {pick(service, "turnaround", lang)}
            </p>
            <div className="mt-5 grid gap-2">
              <Button
                asChild
                className="h-12 w-full rounded-full bg-accent text-base font-semibold text-accent-foreground hover:bg-accent/90"
              >
                <a href={site.phoneHref}>
                  <Phone /> {dict.common.callToBook}
                </a>
              </Button>
              <WhatsAppButton
                label={dict.common.whatsapp}
                message={fill(dict.common.whatsappServiceMessage, { service: pick(service, "name", lang) })}
                className="h-11 w-full"
              />
              <Button asChild variant="outline" className="h-11 w-full rounded-full">
                <a href={site.smsHref}>
                  <MessageSquare /> {dict.common.textUs}
                </a>
              </Button>
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              {t.finalPrice} {fill(dict.common.pricesNote, { tax })}
            </p>
          </div>
          <HelpBox dict={dict} />
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold">{fill(t.more, { category: categoryName.toLowerCase() })}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s) => (
              <ServiceCard key={s.id} service={s} lang={lang} dict={dict} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
