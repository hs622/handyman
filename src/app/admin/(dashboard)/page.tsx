import Link from "next/link";
import { Suspense } from "react";
import { AdminPageSkeleton } from "@/components/admin/page-skeleton";
import { ADMIN_STATUS_LABEL, AdminStatusBadge, LocaleBadge } from "@/components/admin/status-badge";
import { BOOKING_STATUSES, type BookingStatus } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { listBookings } from "@/lib/admin-queries";
import { formatDate, formatDateTime, formatMoney } from "@/lib/format";
import { formatPhone } from "@/lib/phone";
import { cn } from "@/lib/utils";

export const metadata = { title: "Bookings" };

const OPEN: BookingStatus[] = ["pending", "confirmed", "received", "diagnosing", "repairing", "ready"];

export default function AdminBookingsPage({ searchParams }: PageProps<"/admin">) {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <BookingsTable searchParams={searchParams} />
    </Suspense>
  );
}

async function BookingsTable({ searchParams }: Pick<PageProps<"/admin">, "searchParams">) {
  await requireAdmin();
  const { status: statusParam } = await searchParams;
  const status = BOOKING_STATUSES.find((s) => s === statusParam);
  const all = await listBookings();
  const rows = status ? all.filter((b) => b.status === status) : all.filter((b) => OPEN.includes(b.status));
  const countOf = (s: BookingStatus) => all.filter((b) => b.status === s).length;

  const filters: { key: string; label: string; count: number }[] = [
    { key: "", label: "Open", count: all.filter((b) => OPEN.includes(b.status)).length },
    ...BOOKING_STATUSES.map((s) => ({ key: s, label: ADMIN_STATUS_LABEL[s], count: countOf(s) })),
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Bookings</h1>
      <nav aria-label="Filter by status" className="-mx-4 mt-4 overflow-x-auto px-4 pb-2">
        <ul className="flex w-max gap-2">
          {filters.map((f) => {
            const active = (status ?? "") === f.key;
            return (
              <li key={f.key || "open"}>
                <Link
                  href={f.key ? `/admin?status=${f.key}` : "/admin"}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium",
                    active ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted",
                  )}
                >
                  {f.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-xs tabular-nums",
                      active ? "bg-white/20" : "bg-muted",
                    )}
                  >
                    {f.count}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {rows.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed bg-card p-10 text-center text-muted-foreground">
          No bookings here.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-2xl border bg-card">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b bg-muted/50 text-left text-xs text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Code</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Device & repair</th>
                <th className="px-4 py-3 font-semibold">Drop-off</th>
                <th className="px-4 py-3 font-semibold">Quote</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id} className="border-b last:border-0 hover:bg-muted/40">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/bookings/${b.id}`}
                      className="font-mono font-semibold text-primary hover:underline"
                    >
                      {b.code}
                    </Link>
                    <p className="text-xs text-muted-foreground">{formatDateTime(b.createdAt)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="flex items-center gap-1.5 font-medium">
                      {b.customerName} <LocaleBadge locale={b.locale} />
                    </p>
                    <p className="text-xs text-muted-foreground">{formatPhone(b.phone)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">
                      {b.deviceBrand} {b.deviceModel}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {b.service?.name ?? `${b.category.name} — not sure`}
                    </p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatDate(b.preferredDate)}
                    <p className="text-xs text-muted-foreground capitalize">{b.preferredSlot}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {b.quoteCents !== null ? formatMoney(b.quoteCents) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <AdminStatusBadge status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
