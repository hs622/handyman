import { site } from "@/config/site";

/** wa.me link that opens a WhatsApp chat with the shop, optionally with a prefilled message. */
export function whatsappHref(message?: string) {
  const base = `https://wa.me/${site.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
