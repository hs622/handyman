/**
 * Business details. Change these to rebrand the whole site.
 * Placeholder contact details (555-01xx numbers are reserved for fiction) — replace before going live.
 */
export const site = {
  name: "Fixora Concept",
  /** Logo lockup: `main` is bold, `suffix` is shown smaller and lighter (see <BrandName />). */
  brand: { main: "Fixora", suffix: "Concept" },
  phone: "(416) 555-0100",
  phoneHref: "tel:+14165550100",
  smsHref: "sms:+14165550100",
  /** WhatsApp number in international format, digits only (used for wa.me links). */
  whatsappNumber: "14165550100",
  email: "hello@example.com",
  address: "123 Queen St W, Toronto, ON M5H 2M9",
  mapHref: "https://maps.google.com/?q=123+Queen+St+W+Toronto+ON",
  timeZone: "America/Toronto",
  /** Ontario HST. The label comes from the dictionary (HST / TVH). */
  tax: { rate: 0.13 },
  hours: {
    en: [
      { days: "Mon – Sat", time: "10 a.m. – 8 p.m." },
      { days: "Sunday", time: "12 p.m. – 6 p.m." },
    ],
    fr: [
      { days: "Lun – sam", time: "10 h – 20 h" },
      { days: "Dimanche", time: "12 h – 18 h" },
    ],
  },
  warrantyDays: 90,
  stats: { devicesRepaired: "8,000+", sameDay: "70%" },
} as const;
