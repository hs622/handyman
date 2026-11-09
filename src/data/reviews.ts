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
};

export const reviews: StaticReview[] = [];
