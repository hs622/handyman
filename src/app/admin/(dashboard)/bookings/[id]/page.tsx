import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, Mail, MessageSquare, Phone } from "lucide-react";
import { BookingUpdateForm } from "@/components/admin/booking-update-form";
import { AdminPageSkeleton } from "@/components/admin/page-skeleton";
import {
  ADMIN_SLOT_LABEL,
  ADMIN_STATUS_LABEL,
  AdminStatusBadge,
  LocaleBadge,
} from "@/components/admin/status-badge";
import { Stars } from "@/components/site/stars";
import { requireAdmin } from "@/lib/admin-auth";
import { getBooking } from "@/lib/admin-queries";
import { formatDate, formatDateTime, formatMoney, taxOn } from "@/lib/format";
import { formatPhone } from "@/lib/phone";

export const metadata = { title: "Booking" };

export default function AdminBookingPage({ params }: PageProps<"/admin/bookings/[id]">) {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <BookingDetail params={params} />
    </Suspense>
  );
}

async function BookingDetail({ params }: Pick<PageProps<"/admin/bookings/[id]">, "params">) {
  await requireAdmin();
  const booking = await getBooking((await params).id);
  if (!booking) notFound();

  return (
    <div>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> All bookings
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="font-mono text-2xl font-bold">{booking.code}</h1>
        <AdminStatusBadge status={booking.status} />
      </div>
      <p className="text-sm text-muted-foreground">Booked {formatDateTime(booking.createdAt)}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="rounded-2xl border bg-card p-5">
            <h2 className="font-semibold">Customer</h2>
            <p className="mt-2 flex items-center gap-2 text-lg font-medium">
              {booking.customerName} <LocaleBadge locale={booking.locale} />
            </p>
            {booking.locale === "fr" && (
              <p className="text-xs text-muted-foreground">
                Booked on the French site — contact them in French.
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <a
                href={`tel:${booking.phone}`}
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 hover:bg-muted"
              >
                <Phone className="size-4" /> {formatPhone(booking.phone)}
              </a>
              <a
                href={`sms:${booking.phone}`}
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 hover:bg-muted"
              >
                <MessageSquare className="size-4" /> Text
              </a>
              {booking.email && (
                <a
                  href={`mailto:${booking.email}`}
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 hover:bg-muted"
                >
                  <Mail className="size-4" /> {booking.email}
                </a>
              )}
            </div>
          </section>

          <section className="rounded-2xl border bg-card p-5">
            <h2 className="font-semibold">Device</h2>
            <dl className="mt-3 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Device</dt>
                <dd className="font-medium">
                  {booking.deviceBrand} {booking.deviceModel} ({booking.category.name})
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Requested repair</dt>
                <dd className="font-medium">{booking.service?.name ?? "Not sure — diagnose"}</dd>
              </div>
              {booking.quoteCents !== null && (
                <div>
                  <dt className="text-muted-foreground">Quote</dt>
                  <dd className="font-medium">
                    {formatMoney(booking.quoteCents)} + HST {formatMoney(taxOn(booking.quoteCents))} ={" "}
                    {formatMoney(booking.quoteCents + taxOn(booking.quoteCents))}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-muted-foreground">Drop-off</dt>
                <dd className="font-medium">
                  {formatDate(booking.preferredDate)} · {ADMIN_SLOT_LABEL[booking.preferredSlot]}
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-sm text-muted-foreground">Problem described</p>
            <p className="mt-1 rounded-xl bg-muted/60 p-3 text-sm whitespace-pre-wrap">{booking.issue}</p>
          </section>

          <section className="rounded-2xl border bg-card p-5">
            <h2 className="font-semibold">Timeline</h2>
            <ol className="mt-4 space-y-3 border-l pl-5">
              {booking.events.map((ev) => (
                <li key={ev.id} className="relative text-sm">
                  <span className="absolute top-1.5 -left-[25px] size-2 rounded-full bg-primary" />
                  <span className="font-medium">{ADMIN_STATUS_LABEL[ev.status]}</span>
                  <span className="text-muted-foreground"> · {formatDateTime(ev.createdAt)}</span>
                  {ev.note && <p className="text-muted-foreground">{ev.note}</p>}
                </li>
              ))}
            </ol>
          </section>

          {booking.review && (
            <section className="rounded-2xl border bg-card p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Customer review</h2>
                <Link href="/admin/reviews" className="text-sm text-primary">
                  Moderate
                </Link>
              </div>
              <Stars
                rating={booking.review.rating}
                label={`${booking.review.rating} out of 5 stars`}
                className="mt-2"
              />
              <p className="mt-2 text-sm">“{booking.review.body}”</p>
              <p className="mt-1 text-xs text-muted-foreground">
                — {booking.review.displayName} · {booking.review.status}
              </p>
            </section>
          )}
        </div>

        <aside className="h-fit rounded-2xl border bg-card p-5 lg:sticky lg:top-20">
          <h2 className="mb-4 font-semibold">Update booking</h2>
          <BookingUpdateForm
            bookingId={booking.id}
            status={booking.status}
            quoteCents={booking.quoteCents}
            adminNotes={booking.adminNotes}
          />
        </aside>
      </div>
    </div>
  );
}
