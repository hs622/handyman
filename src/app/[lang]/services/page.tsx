import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Search, SearchX, Wrench } from "lucide-react";
import { CategoryIcon } from "@/components/site/category-icon";
import { HelpBox } from "@/components/site/help-box";
import { ServiceCard } from "@/components/site/service-card";
import { localePath, pick } from "@/i18n/config";
import { fill } from "@/i18n/fill";
import { alternates } from "@/i18n/metadata";
import { getDictionary } from "@/i18n/server";
import { taxLabel } from "@/lib/format";
import { getActiveServices, getCategories } from "@/lib/queries";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const { lang, dict } = await getDictionary();
  return {
    title: dict.services.metaTitle,
    description: dict.services.metaDescription,
    alternates: alternates(lang, "/services"),
  };
}

export default async function ServicesPage({ searchParams }: PageProps<"/[lang]/services">) {
  const { lang, dict } = await getDictionary();
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-start gap-4">
        <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
          <Wrench className="size-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{dict.services.title}</h1>
          <p className="mt-1 text-muted-foreground">
            {dict.services.intro} {fill(dict.common.pricesNote, { tax: taxLabel(lang, dict.common.taxName) })}
          </p>
        </div>
      </div>
      <Suspense fallback={<ServicesSkeleton />}>
        <ServicesBrowser searchParams={searchParams} />
      </Suspense>
      <div className="mt-10 max-w-xl">
        <HelpBox dict={dict} title={dict.services.cantFind} text={dict.services.cantFindText} />
      </div>
    </div>
  );
}

async function ServicesBrowser({ searchParams }: Pick<PageProps<"/[lang]/services">, "searchParams">) {
  const { lang, dict } = await getDictionary();
  const t = dict.services;
  const params = await searchParams;
  const category = typeof params.category === "string" ? params.category : "";
  const q = typeof params.q === "string" ? params.q.trim() : "";

  const [categories, services] = await Promise.all([getCategories(), getActiveServices()]);
  // Search both languages, accent-insensitive ("ecran" matches "écran").
  const norm = (s: string) =>
    s
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();
  const needle = norm(q);
  const filtered = services.filter(
    (s) =>
      (!category || s.categorySlug === category) &&
      (!needle ||
        norm(
          [s.name, s.nameFr, s.description, s.descriptionFr, s.categoryName, s.categoryNameFr].join(" "),
        ).includes(needle)),
  );

  const servicesPath = localePath(lang, "/services");
  const chipHref = (slug: string) => {
    const sp = new URLSearchParams();
    if (slug) sp.set("category", slug);
    if (q) sp.set("q", q);
    const qs = sp.toString();
    return qs ? `${servicesPath}?${qs}` : servicesPath;
  };

  return (
    <>
      <form action={servicesPath} role="search" className="mb-4">
        {category && <input type="hidden" name="category" value={category} />}
        <label className="relative block">
          <span className="sr-only">{t.searchLabel}</span>
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            name="q"
            type="search"
            defaultValue={q}
            placeholder={t.searchPlaceholder}
            className="h-12 w-full rounded-full border bg-card pr-4 pl-11 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
          />
        </label>
      </form>

      <nav aria-label={t.categoriesLabel} className="-mx-4 mb-4 overflow-x-auto px-4 pb-2">
        <ul className="flex w-max gap-2">
          {[
            { slug: "", label: t.all, icon: "wrench" },
            ...categories.map((c) => ({ slug: c.slug, label: pick(c, "name", lang), icon: c.icon })),
          ].map((c) => {
            const active = c.slug === category;
            return (
              <li key={c.slug || "all"}>
                <Link
                  href={chipHref(c.slug)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition",
                    active ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted",
                  )}
                >
                  <CategoryIcon name={c.icon} className="size-4" /> {c.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <p className="mb-4 text-sm text-muted-foreground">
        {filtered.length === 1 ? t.countOne : fill(t.count, { count: filtered.length })}
        {q && (
          <>
            {" "}
            {fill(t.forQuery, { q })} ·{" "}
            <Link href={chipHref(category)} className="text-primary underline-offset-4 hover:underline">
              {t.clearSearch}
            </Link>
          </>
        )}
      </p>

      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <ServiceCard key={s.id} service={s} lang={lang} dict={dict} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-dashed bg-card py-16 text-center">
          <SearchX className="size-10 text-muted-foreground" />
          <p className="mt-3 font-semibold">{t.noneTitle}</p>
          <p className="text-sm text-muted-foreground">{t.noneText}</p>
          <Link href={servicesPath} className="mt-4 text-sm font-medium text-primary">
            {t.showAll}
          </Link>
        </div>
      )}
    </>
  );
}

function ServicesSkeleton() {
  return (
    <div aria-busy className="space-y-4">
      <div className="h-12 animate-pulse rounded-full bg-muted" />
      <div className="flex gap-2">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-9 w-28 animate-pulse rounded-full bg-muted" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-56 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
