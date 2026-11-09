/**
 * Customer reviews shown on the site.
 *
 * Add only real reviews from real customers, with their permission. The home page review
 * section and the reviews page list stay hidden/empty until this array has entries.
 *
 * Example entry:
 *   {
 *     id: 1,
 *     rating: 5,
 *     body: "Screen replaced in about an hour and it looks original.",
 *     displayName: "Emily C.",
 *     date: "2026-11-02",
 *     service: "phone-screen-replacement", // optional: a slug from catalog.ts
 *     device: "iPhone 14",
 *   },
 */
export type StaticReview = {
  id: number;
  rating: 1 | 2 | 3 | 4 | 5;
  body: string;
  displayName: string;
  /** YYYY-MM-DD */
  date: string;
  service?: string;
  device: string;
  /** Placeholder content: shown with a "Sample review" label. Remove these once real reviews exist. */
  sample?: boolean;
};

/**
 * SAMPLE reviews (placeholders so the layout can be previewed). They are labelled
 * "Sample review" on the site — delete them and add real reviews before relying on them.
 */
export const reviews: StaticReview[] = [
  {
    id: 1,
    rating: 5,
    body: "Cracked screen replaced in about an hour while I grabbed a coffee. Looks and feels like the original.",
    displayName: "Emily C.",
    date: "2026-10-28",
    service: "phone-screen-replacement",
    device: "iPhone 14",
    sample: true,
  },
  {
    id: 2,
    rating: 5,
    body: "Mon portable démarre maintenant en quelques secondes. Ils ont transféré tous mes fichiers sans problème.",
    displayName: "Marc-André T.",
    date: "2026-10-22",
    service: "laptop-ssd-upgrade",
    device: "Dell XPS 13",
    sample: true,
  },
  {
    id: 3,
    rating: 4,
    body: "PS5 had no picture. Took two days for the HDMI port, but they kept me updated by text the whole time.",
    displayName: "Priya P.",
    date: "2026-10-15",
    service: "console-hdmi-port",
    device: "PlayStation 5",
    sample: true,
  },
  {
    id: 4,
    rating: 5,
    body: "Battery was dying by noon. New one fitted in 45 minutes and the price matched the quote exactly.",
    displayName: "Jordan S.",
    date: "2026-10-09",
    service: "phone-battery-replacement",
    device: "Galaxy S23",
    sample: true,
  },
  {
    id: 5,
    rating: 5,
    body: "Service rapide et courtois, en français en plus! L'écran de ma tablette est comme neuf.",
    displayName: "Sophie G.",
    date: "2026-09-30",
    service: "tablet-screen-replacement",
    device: "iPad Air",
    sample: true,
  },
  {
    id: 6,
    rating: 4,
    body: "Laptop was overheating and loud. Cleaned and repasted the same afternoon — runs quiet now.",
    displayName: "Daniel O.",
    date: "2026-09-21",
    service: "laptop-overheating",
    device: "HP Pavilion 15",
    sample: true,
  },
];
