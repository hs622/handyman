import { categories as categoryData, services as serviceData } from "@/data/catalog";
import { reviews as reviewData } from "@/data/reviews";

/** Static data layer — same shape the pages used when this came from the database. */

export type DeviceCategory = {
  id: number;
  slug: string;
  name: string;
  nameFr: string;
  icon: string;
  sort: number;
};

const categoryList: DeviceCategory[] = categoryData
  .map((c, i) => ({ ...c, id: i + 1 }))
  .sort((a, b) => a.sort - b.sort);

const categoryBySlug = new Map(categoryList.map((c) => [c.slug, c]));

const serviceList = serviceData
  .filter((s) => s.active !== false)
  .map((s, i) => {
    const c = categoryBySlug.get(s.category)!;
    return {
      id: i + 1,
      slug: s.slug,
      name: s.name,
      nameFr: s.nameFr,
      description: s.description,
      descriptionFr: s.descriptionFr,
      priceFromCents: s.priceFromCents,
      turnaround: s.turnaround,
      turnaroundFr: s.turnaroundFr,
      sort: s.sort,
      categoryId: c.id,
      categorySlug: c.slug,
      categoryName: c.name,
      categoryNameFr: c.nameFr,
      categoryIcon: c.icon,
      categorySort: c.sort,
    };
  })
  .sort((a, b) => a.categorySort - b.categorySort || a.sort - b.sort);

export type ServiceWithCategory = (typeof serviceList)[number];

export const getCategories = () => categoryList;
export const getActiveServices = () => serviceList;
export const getServiceBySlug = (slug: string) => serviceList.find((s) => s.slug === slug) ?? null;

const reviewList = reviewData
  .map((r) => {
    const service = r.service ? serviceList.find((s) => s.slug === r.service) : undefined;
    return {
      id: r.id,
      rating: r.rating,
      body: r.body,
      displayName: r.displayName,
      createdAt: new Date(`${r.date}T12:00:00`),
      serviceName: service?.name ?? null,
      serviceNameFr: service?.nameFr ?? null,
      device: r.device,
    };
  })
  .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

export const getPublishedReviews = (limit = 50) => reviewList.slice(0, limit);

export function getReviewSummary() {
  const count = reviewList.length;
  const average = count ? reviewList.reduce((sum, r) => sum + r.rating, 0) / count : 0;
  const distribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviewList.filter((r) => r.rating === rating).length,
  }));
  return { count, average, distribution };
}
