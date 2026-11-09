import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  MapPin,
  MessageSquare,
  PackageCheck,
  Phone,
  ShieldCheck,
  Star,
  Store,
  Timer,
  Wrench,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CategoryIcon } from "@/components/site/category-icon";
import { HelpBox } from "@/components/site/help-box";
import { HeroCarousel } from "@/components/site/hero-carousel";
import { ReviewCard } from "@/components/site/review-card";
import { SectionHeading } from "@/components/site/section-heading";
import { ServiceCard } from "@/components/site/service-card";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { site } from "@/config/site";
import { localePath, localeTag, pick } from "@/i18n/config";
import { fill } from "@/i18n/fill";
import { getDictionary } from "@/i18n/server";
import {
  getActiveServices,
  getCategories,
  getPublishedReviews,
  getReviewSummary,
  onlySampleReviews,
} from "@/lib/catalog";
import { whatsappHref } from "@/lib/contact";
import { taxLabel } from "@/lib/format";

const STEP_ICONS = [Phone, Store, ClipboardCheck, PackageCheck];

export default async function HomePage() {
  const { lang, dict } = await getDictionary();
  const categories = getCategories();
  const services = getActiveServices();
  const summary = getReviewSummary();
  const reviews = getPublishedReviews(3);
  // Placeholder reviews are shown (labelled) but never counted as a real average rating.
  const hasReviews = summary.count > 0 && !onlySampleReviews();

  const popular = [...services].sort((a, b) => a.priceFromCents - b.priceFromCents).slice(0, 6);
  const average = summary.average.toLocaleString(localeTag[lang], {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const tax = taxLabel(lang, dict.common.taxName);
  const slideHrefs = [
    site.phoneHref,
    localePath(lang, "/services?category=phones"),
    whatsappHref(dict.common.whatsappMessage),
  ];
  const h = dict.home;
  const tileClass =
    "flex flex-col items-center gap-2 rounded-2xl border border-transparent p-3 text-center text-sm font-medium transition hover:border-border hover:bg-muted";

  const stats = [
    ...(hasReviews ? [{ icon: Star, value: average, label: h.why.rating }] : []),
    { icon: Wrench, value: site.stats.devicesRepaired, label: h.why.repaired },
    { icon: Timer, value: site.stats.sameDay, label: h.why.sameDay },
    {
      icon: ShieldCheck,
      value: fill(h.why.warrantyValue, { days: site.warrantyDays }),
      label: h.why.warranty,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-16 px-4 py-6 sm:py-8">
      {/* Hero */}
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <HeroCarousel slides={h.slides.map((s, i) => ({ ...s, href: slideHrefs[i] }))} labels={h.carousel} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <a
            href={site.mapHref}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col justify-between rounded-3xl border bg-card p-6 shadow-xs transition hover:border-primary/40"
          >
            <MapPin className="size-8 text-primary" />
            <div className="mt-6">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                {h.visit.eyebrow}
              </p>
              <p className="mt-1 text-lg font-bold">{h.visit.title}</p>
              <p className="text-sm text-muted-foreground">{site.address}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary">
                {dict.common.getDirections}{" "}
                <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </span>
            </div>
          </a>
          {hasReviews ? (
            <Link
              href={localePath(lang, "/reviews")}
              className="group flex flex-col justify-between rounded-3xl bg-accent p-6 text-accent-foreground transition hover:brightness-105"
            >
              <Star className="size-8 fill-current" />
              <div className="mt-6">
                <p className="text-3xl font-extrabold">{average}</p>
                <p className="text-sm font-medium opacity-80">
                  {fill(h.reviewsFrom, { count: summary.count })}
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex flex-col justify-between rounded-3xl bg-accent p-6 text-accent-foreground">
              <ShieldCheck className="size-8" />
              <div className="mt-6">
                <p className="text-2xl font-extrabold">{fill(h.warrantyCard, { days: site.warrantyDays })}</p>
                <p className="text-sm font-medium opacity-80">{h.warrantyCardText}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick access */}
      <section className="rounded-3xl border bg-card p-5 sm:p-7">
        <SectionHeading
          eyebrow={h.quickAccess.eyebrow}
          title={h.quickAccess.title}
          description={h.quickAccess.description}
        />
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {categories.map((c) => (
            <li key={c.id}>
              <Link href={localePath(lang, `/services?category=${c.slug}`)} className={tileClass}>
                <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <CategoryIcon name={c.icon} className="size-6" />
                </span>
                {pick(c, "name", lang)}
              </Link>
            </li>
          ))}
          <li>
            <Link href={localePath(lang, "/reviews")} className={tileClass}>
              <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-success/15 text-success">
                <BadgeCheck className="size-6" />
              </span>
              {h.quickAccess.reviews}
            </Link>
          </li>
        </ul>
      </section>

      {/* Popular services */}
      <section>
        <SectionHeading
          eyebrow={h.popular.eyebrow}
          title={h.popular.title}
          description={`${h.popular.description} ${fill(dict.common.pricesNote, { tax })}`}
          action={
            <Button asChild variant="outline" className="h-10 rounded-full px-4">
              <Link href={localePath(lang, "/services")}>
                {dict.common.allServices} <ArrowRight />
              </Link>
            </Button>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((s) => (
            <ServiceCard key={s.id} service={s} lang={lang} dict={dict} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section>
        <SectionHeading eyebrow={h.how.eyebrow} title={h.how.title} />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {h.how.steps.map((step, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <li key={step.title} className="relative rounded-2xl border bg-card p-5">
                <span className="absolute top-5 right-5 text-4xl font-extrabold text-muted-foreground/15">
                  {i + 1}
                </span>
                <Icon className="size-7 text-primary" />
                <p className="mt-4 font-semibold">{step.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Why choose us */}
      <section className="rounded-3xl bg-primary p-7 text-primary-foreground sm:p-10">
        <h2 className="text-2xl font-bold sm:text-3xl">{h.why.title}</h2>
        <dl
          className={`mt-8 grid grid-cols-2 gap-6 ${stats.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
        >
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col">
              <s.icon className="size-6 opacity-80" />
              <dt className="order-3 text-sm opacity-80">{s.label}</dt>
              <dd className="order-2 mt-3 text-3xl font-extrabold">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Reviews (hidden until src/data/reviews.ts has entries) */}
      {reviews.length > 0 && (
        <section>
          <SectionHeading
            eyebrow={h.reviews.eyebrow}
            title={h.reviews.title}
            description={onlySampleReviews() ? dict.reviews.sampleNote : undefined}
            action={
              <Button asChild variant="outline" className="h-10 rounded-full px-4">
                <Link href={localePath(lang, "/reviews")}>
                  {h.reviews.readAll} <ArrowRight />
                </Link>
              </Button>
            }
          />
          <div className="grid gap-4 md:grid-cols-3">
            {reviews.map((r) => (
              <ReviewCard key={r.id} review={r} lang={lang} dict={dict} />
            ))}
          </div>
        </section>
      )}

      {/* FAQ + help */}
      <section className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <SectionHeading eyebrow={h.faq.eyebrow} title={h.faq.title} />
          <Accordion type="single" collapsible className="rounded-2xl border bg-card px-5">
            {h.faq.items.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-base">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {fill(f.a, { days: site.warrantyDays, tax })}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="lg:pt-14">
          <HelpBox dict={dict} />
        </div>
      </section>

      {/* CTA banner */}
      <section className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-accent p-7 text-accent-foreground sm:flex-row sm:items-center sm:p-10">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">{h.cta.title}</h2>
          <p className="mt-1 opacity-80">{h.cta.text}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            asChild
            className="h-12 rounded-full bg-foreground px-6 text-base font-semibold text-background hover:bg-foreground/90"
          >
            <a href={site.phoneHref}>
              <Phone /> {site.phone}
            </a>
          </Button>
          <WhatsAppButton
            label={dict.common.whatsapp}
            message={dict.common.whatsappMessage}
            className="h-12 px-6 text-base font-semibold"
          />
          <Button
            asChild
            variant="outline"
            className="h-12 rounded-full border-foreground/20 bg-transparent px-6 text-base font-semibold hover:bg-foreground/10"
          >
            <a href={site.smsHref}>
              <MessageSquare /> {dict.common.textUs}
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
