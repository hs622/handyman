import { localeTag, locales, type Locale } from "./config";

/** canonical + hreflang alternates for a path that exists in every locale ("/services"). */
export function alternates(lang: Locale, path = "") {
  return {
    canonical: `/${lang}${path}`,
    languages: Object.fromEntries([
      ...locales.map((l) => [localeTag[l], `/${l}${path}`]),
      ["x-default", `/en${path}`],
    ]),
  };
}
