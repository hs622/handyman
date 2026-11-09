import Link from "next/link";
import { Suspense } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AdminPageSkeleton } from "@/components/admin/page-skeleton";
import { Stars } from "@/components/site/stars";
import { Button } from "@/components/ui/button";
import { setReviewStatus } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/admin-auth";
import { listAllReviews } from "@/lib/admin-queries";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata = { title: "Reviews" };

export default function AdminReviewsPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <ReviewsList />
    </Suspense>
  );
}

async function ReviewsList() {
  await requireAdmin();
  const reviews = await listAllReviews();

  return (
    <div>
      <h1 className="text-2xl font-bold">Reviews</h1>
      <p className="text-sm text-muted-foreground">
        Reviews publish automatically after a completed repair. Hide any that break your policy.
      </p>
      {reviews.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed bg-card p-10 text-center text-muted-foreground">
          No reviews yet.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {reviews.map((r) => {
            const next = r.status === "published" ? "hidden" : "published";
            return (
              <li
                key={r.id}
                className={cn("rounded-2xl border bg-card p-5", r.status === "hidden" && "opacity-60")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Stars rating={r.rating} label={`${r.rating} out of 5 stars`} />
                    <p className="mt-1 text-sm font-semibold">{r.displayName}</p>
                    <p className="text-xs text-muted-foreground">
                      <Link
                        href={`/admin/bookings/${r.bookingId}`}
                        className="font-mono text-primary hover:underline"
                      >
                        {r.bookingCode}
                      </Link>{" "}
                      · {r.device} · {formatDate(r.createdAt)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      r.status === "published"
                        ? "bg-success/15 text-success"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {r.status}
                  </span>
                </div>
                <p className="mt-3 text-sm">“{r.body}”</p>
                <form action={setReviewStatus.bind(null, r.id, next)} className="mt-4">
                  <Button type="submit" variant="outline" size="sm" className="rounded-full">
                    {next === "hidden" ? <EyeOff /> : <Eye />} {next === "hidden" ? "Hide" : "Publish"}
                  </Button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
