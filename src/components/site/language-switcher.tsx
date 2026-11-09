"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { LOCALE_COOKIE, localeName, switchLocalePath, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

const ONE_YEAR = 60 * 60 * 24 * 365;

function rememberLocale(to: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${to}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
}

const linkClass =
  "inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground";

export function LanguageSwitcher({ current, className }: { current: Locale; className?: string }) {
  const pathname = usePathname();
  const to: Locale = current === "en" ? "fr" : "en";
  return (
    <Link
      href={switchLocalePath(pathname, to)}
      hrefLang={to}
      lang={to}
      onClick={() => rememberLocale(to)}
      aria-label={localeName[to]}
      className={cn(linkClass, className)}
    >
      <Languages className="size-4" /> {to.toUpperCase()}
    </Link>
  );
}

/** Suspense fallback: links to the other language's home page. */
export function LanguageSwitcherFallback({ current, className }: { current: Locale; className?: string }) {
  const to: Locale = current === "en" ? "fr" : "en";
  return (
    <Link
      href={`/${to}`}
      hrefLang={to}
      lang={to}
      aria-label={localeName[to]}
      className={cn(linkClass, className)}
    >
      <Languages className="size-4" /> {to.toUpperCase()}
    </Link>
  );
}
