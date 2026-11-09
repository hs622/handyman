import type { Metadata } from "next";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { ThemeScript } from "@/components/theme-script";
import { site } from "@/config/site";
import { localeTag, locales } from "@/i18n/config";
import { alternates } from "@/i18n/metadata";
import { getDictionary } from "@/i18n/server";
import { fontClasses } from "../fonts";
import "../globals.css";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { lang, dict } = await getDictionary();
  return {
    metadataBase: new URL(
      process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000",
    ),
    title: { default: `${site.name} — ${dict.meta.tagline}`, template: `%s | ${site.name}` },
    description: dict.meta.description,
    alternates: alternates(lang),
    openGraph: { locale: localeTag[lang].replace("-", "_"), siteName: site.name },
  };
}

export default async function SiteRootLayout({ children }: LayoutProps<"/[lang]">) {
  const { lang } = await getDictionary();
  return (
    <html lang={localeTag[lang]} suppressHydrationWarning className={`${fontClasses} h-full antialiased`}>
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
