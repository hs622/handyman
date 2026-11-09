import Link from "next/link";
import { Clock, Mail, MapPin, Phone, Wrench } from "lucide-react";
import { site } from "@/config/site";
import { localePath } from "@/i18n/config";
import { fill } from "@/i18n/fill";
import { getDictionary } from "@/i18n/server";
import { taxLabel } from "@/lib/format";

export async function SiteFooter() {
  const { lang, dict } = await getDictionary();
  const links = [
    { href: localePath(lang), label: dict.nav.home },
    { href: localePath(lang, "/services"), label: dict.nav.services },
    { href: localePath(lang, "/reviews"), label: dict.nav.reviews },
  ];
  return (
    <footer className="mt-16 border-t bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href={localePath(lang)} className="flex items-center gap-2 font-bold">
            <span className="inline-flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Wrench className="size-5" />
            </span>
            {site.name}
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">{dict.meta.description}</p>
        </div>
        <div>
          <p className="font-semibold">{dict.footer.explore}</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {links.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-foreground">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold">{dict.footer.visit}</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <a href={site.mapHref} target="_blank" rel="noreferrer" className="hover:text-foreground">
                {site.address}
              </a>
            </li>
            {site.hours[lang].map((h) => (
              <li key={h.days} className="flex gap-2">
                <Clock className="mt-0.5 size-4 shrink-0" /> {h.days}
                {lang === "fr" ? " : " : ": "}
                {h.time}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold">{dict.footer.contact}</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <Phone className="mt-0.5 size-4 shrink-0" />
              <a href={site.phoneHref} className="hover:text-foreground">
                {site.phone}
              </a>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 size-4 shrink-0" />
              <a href={`mailto:${site.email}`} className="hover:text-foreground">
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t px-4 py-5 text-center text-xs text-muted-foreground">
        © {site.name}. {fill(dict.footer.warranty, { days: site.warrantyDays })}{" "}
        {fill(dict.common.pricesNote, { tax: taxLabel(lang, dict.common.taxName) })}
      </div>
    </footer>
  );
}
