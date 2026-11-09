import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE, defaultLocale, hasLocale, type Locale } from "@/i18n/config";

/** Pick the visitor's language: saved choice → browser Accept-Language → English. */
function detectLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (saved && hasLocale(saved)) return saved;

  const header = request.headers.get("accept-language") ?? "";
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.toLowerCase().slice(0, 2), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  const match = ranked.find((r) => hasLocale(r.lang));
  return match ? (match.lang as Locale) : defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Already localized: /en/..., /fr/...
  const first = pathname.split("/")[1];
  if (first && hasLocale(first)) return NextResponse.next();

  // Everything else gets a locale prefix: / → /fr, /services → /en/services
  const locale = detectLocale(request);
  const url = new URL(`/${locale}${pathname === "/" ? "" : pathname}${search}`, request.url);
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, API routes and files with an extension (favicon.ico, images…).
  matcher: ["/((?!_next/|api/|.*\\..*).*)"],
};
