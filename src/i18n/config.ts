export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const hasLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

/** BCP-47 tags used for Intl formatting (Canadian English / Canadian French). */
export const localeTag: Record<Locale, string> = { en: "en-CA", fr: "fr-CA" };

export const localeName: Record<Locale, string> = { en: "English", fr: "Français" };

export const LOCALE_COOKIE = "NEXT_LOCALE";

/** Prefix an internal path with the locale: ("fr", "/services") → "/fr/services". */
export function localePath(lang: Locale, path = "/") {
  return path === "/" ? `/${lang}` : `/${lang}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Swap the locale segment of a pathname: ("/en/services/x", "fr") → "/fr/services/x". */
export function switchLocalePath(pathname: string, to: Locale) {
  const parts = pathname.split("/");
  if (parts[1] && hasLocale(parts[1])) parts[1] = to;
  else parts.splice(1, 0, to);
  return parts.join("/") || `/${to}`;
}

/** Pick the localized value from a row with `<field>` / `<field>Fr` columns. */
export function pick<T extends Record<string, unknown>, K extends string & keyof T>(
  row: T,
  field: K,
  lang: Locale,
): T[K] {
  if (lang === "fr") {
    const fr = row[`${field}Fr` as keyof T];
    if (typeof fr === "string" && fr.length > 0) return fr as T[K];
  }
  return row[field];
}
