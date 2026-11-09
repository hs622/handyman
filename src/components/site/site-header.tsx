import { Suspense } from "react";
import Link from "next/link";
import { Phone, Search, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import { localePath } from "@/i18n/config";
import { fill } from "@/i18n/fill";
import { getDictionary } from "@/i18n/server";
import { LanguageSwitcher, LanguageSwitcherFallback } from "./language-switcher";
import { MobileMenu } from "./mobile-menu";
import { NavLinks, StaticNavLinks, type NavItem } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";
import { WhatsAppButton } from "./whatsapp-button";

function SearchForm({
  action,
  placeholder,
  label,
  className,
}: {
  action: string;
  placeholder: string;
  label: string;
  className?: string;
}) {
  return (
    <form action={action} role="search" className={className}>
      <label className="relative block">
        <span className="sr-only">{label}</span>
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          name="q"
          type="search"
          placeholder={placeholder}
          className="h-10 w-full rounded-full border bg-background pr-4 pl-10 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
        />
      </label>
    </form>
  );
}

export async function SiteHeader() {
  const { lang, dict } = await getDictionary();
  const items: NavItem[] = [
    { href: localePath(lang), label: dict.nav.home, exact: true },
    { href: localePath(lang, "/services"), label: dict.nav.services },
    { href: localePath(lang, "/reviews"), label: dict.nav.reviews },
  ];
  const search = {
    action: localePath(lang, "/services"),
    placeholder: dict.header.search,
    label: dict.header.searchLabel,
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div className="bg-primary px-4 py-1.5 text-center text-xs font-medium text-primary-foreground">
        {fill(dict.header.banner, { days: site.warrantyDays })}
      </div>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4">
        <Suspense>
          <MobileMenu
            items={items}
            title={site.name}
            callHref={site.phoneHref}
            callLabel={`${dict.common.callToBook} · ${site.phone}`}
            openLabel={dict.common.openMenu}
          >
            {/* On phones the language switch lives in the menu to keep the header row narrow. */}
            <WhatsAppButton
              label={dict.common.whatsapp}
              message={dict.common.whatsappMessage}
              className="h-11 w-full"
            />
            <LanguageSwitcher current={lang} className="self-start border" />
          </MobileMenu>
        </Suspense>
        <Link href={localePath(lang)} className="flex shrink-0 items-center gap-2 font-bold tracking-tight">
          <span className="inline-flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Wrench className="size-5" />
          </span>
          <span className="hidden xl:inline">{site.name}</span>
          <span className="xl:hidden">{site.shortName}</span>
        </Link>
        <Suspense
          fallback={<StaticNavLinks items={items} className="ml-2 hidden items-center gap-1 md:flex" />}
        >
          <NavLinks items={items} className="ml-2 hidden items-center gap-1 md:flex" />
        </Suspense>
        <div className="ml-auto flex items-center gap-1">
          <SearchForm {...search} className="mr-2 hidden w-60 xl:block" />
          <a
            href={site.phoneHref}
            className="mr-2 hidden items-center gap-2 text-sm font-medium whitespace-nowrap 2xl:flex"
          >
            <Phone className="size-4 text-primary" /> {site.phone}
          </a>
          <Suspense fallback={<LanguageSwitcherFallback current={lang} className="hidden md:inline-flex" />}>
            <LanguageSwitcher current={lang} className="hidden md:inline-flex" />
          </Suspense>
          <ThemeToggle label={dict.common.toggleTheme} />
          <Button
            asChild
            className="h-10 rounded-full bg-accent px-3 font-semibold text-accent-foreground shadow-sm hover:bg-accent/90 sm:px-4"
          >
            <a href={site.phoneHref} aria-label={`${dict.common.callToBook} ${site.phone}`}>
              <Phone /> <span className="hidden sm:inline">{dict.common.callToBook}</span>
              <span className="sm:hidden">{dict.common.call}</span>
            </a>
          </Button>
        </div>
      </div>
      <div className="px-4 pb-3 xl:hidden">
        <SearchForm {...search} />
      </div>
    </header>
  );
}
