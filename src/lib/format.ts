import { localeTag, type Locale } from "@/i18n/config";
import { site } from "@/config/site";

/** Money is stored as integer cents (CAD). 14900 → "$149.00" (en) / "149,00 $" (fr). */
export function formatMoney(cents: number, lang: Locale = "en", opts: { compact?: boolean } = {}) {
  const whole = cents % 100 === 0;
  return new Intl.NumberFormat(localeTag[lang], {
    style: "currency",
    currency: "CAD",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: opts.compact && whole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export const formatDate = (d: Date | string, lang: Locale = "en") =>
  new Date(typeof d === "string" && d.length === 10 ? `${d}T12:00:00` : d).toLocaleDateString(
    localeTag[lang],
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: site.timeZone,
    },
  );

/** "13% HST" (en) / "13 % TVH" (fr) — the tax label comes from the dictionary. */
export const taxLabel = (lang: Locale, taxName: string) =>
  `${new Intl.NumberFormat(localeTag[lang], { style: "percent" }).format(site.tax.rate)} ${taxName}`;
