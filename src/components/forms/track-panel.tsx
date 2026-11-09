"use client";

import { useActionState } from "react";
import { Check, Loader2, PackageSearch, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BOOKING_STATUSES, type BookingStatus } from "@/db/schema";
import { pick, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/i18n/fill";
import { trackBooking, type TrackState } from "@/lib/actions/booking";
import { formatDate, formatDateTime, formatMoney, taxOn } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Field, inputClass } from "./field";
import { ReviewForm } from "./review-form";

const FLOW: BookingStatus[] = BOOKING_STATUSES.filter((s) => s !== "cancelled");

type TrackDict = Pick<
  Dictionary,
  "track" | "status" | "statusHint" | "slotShort" | "errors" | "review" | "common" | "book"
>;

export function TrackPanel({ lang, dict }: { lang: Locale; dict: TrackDict }) {
  const t = dict.track;
  const [state, action, pending] = useActionState<TrackState, FormData>(trackBooking, {});
  const booking = state.booking;

  return (
    <div className="space-y-6">
      <form action={action} className="rounded-3xl border bg-card p-5 sm:p-7">
        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <Field id="code" label={t.code}>
            <input
              id="code"
              name="code"
              required
              defaultValue={state.code}
              placeholder="TR-XXXXXX"
              autoCapitalize="characters"
              className={cn(inputClass, "font-mono uppercase")}
            />
          </Field>
          <Field id="phone" label={t.phone}>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              required
              placeholder={dict.book.form.phonePlaceholder}
              className={inputClass}
            />
          </Field>
          <Button type="submit" disabled={pending} className="h-11 rounded-full px-6">
            {pending ? <Loader2 className="animate-spin" /> : <PackageSearch />} {t.submit}
          </Button>
        </div>
        {state.message && (
          <p role="alert" className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {dict.errors[state.message]}
          </p>
        )}
      </form>

      {booking && (
        <section aria-live="polite" className="rounded-3xl border bg-card p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-mono text-sm text-muted-foreground">{booking.code}</p>
              <h2 className="text-xl font-bold">{booking.device}</h2>
              <p className="text-sm text-muted-foreground">
                {booking.service
                  ? pick(booking.service, "name", lang)
                  : fill(t.repairOf, { category: pick(booking.category, "name", lang) })}{" "}
                ·{" "}
                {fill(t.dropoff, {
                  date: formatDate(booking.preferredDate, lang),
                  slot: dict.slotShort[booking.preferredSlot],
                })}
              </p>
            </div>
            <StatusBadge status={booking.status} label={dict.status[booking.status]} />
          </div>

          <p className="mt-4 rounded-2xl bg-muted/60 p-4 text-sm">{dict.statusHint[booking.status]}</p>

          {booking.quoteCents !== null && (
            <p className="mt-3 text-sm">
              {t.quote}{" "}
              <span className="font-semibold">
                {fill(t.quoteTax, {
                  amount: formatMoney(booking.quoteCents, lang),
                  tax: dict.common.taxName,
                  taxAmount: formatMoney(taxOn(booking.quoteCents), lang),
                  total: formatMoney(booking.quoteCents + taxOn(booking.quoteCents), lang),
                })}
              </span>
            </p>
          )}

          {booking.status !== "cancelled" && (
            <ol className="mt-6 grid grid-cols-7 gap-1" aria-label={t.progress}>
              {FLOW.map((s, i) => {
                const done = booking.status === "completed";
                const current = done ? FLOW.length : FLOW.indexOf(booking.status);
                return (
                  <li key={s} className="flex flex-col items-center gap-2 text-center">
                    <span
                      className={cn(
                        "flex size-7 items-center justify-center rounded-full border-2 text-xs font-bold",
                        i < current && "border-primary bg-primary text-primary-foreground",
                        i === current && "border-primary text-primary",
                        i > current && "border-muted text-muted-foreground",
                      )}
                      aria-current={i === current ? "step" : undefined}
                    >
                      {i < current ? <Check className="size-4" /> : i + 1}
                    </span>
                    <span
                      className={cn(
                        "hidden text-[11px] leading-tight sm:block",
                        i > current && "text-muted-foreground",
                      )}
                    >
                      {dict.status[s]}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}

          <h3 className="mt-8 mb-3 font-semibold">{t.timeline}</h3>
          <ol className="relative space-y-4 border-l pl-6">
            {[...booking.events].reverse().map((ev) => (
              <li key={ev.id} className="relative">
                <span className="absolute top-1.5 -left-[29px] size-2.5 rounded-full bg-primary ring-4 ring-card" />
                <p className="text-sm font-medium">{dict.status[ev.status]}</p>
                {ev.note && <p className="text-sm text-muted-foreground">{ev.note}</p>}
                <p className="text-xs text-muted-foreground">{formatDateTime(ev.createdAt, lang)}</p>
              </li>
            ))}
          </ol>

          {booking.status === "completed" && (
            <div className="mt-8 border-t pt-6">
              <h3 className="mb-3 text-lg font-semibold">{t.howDidWeDo}</h3>
              {booking.hasReview ? (
                <p className="text-sm text-muted-foreground">{t.alreadyReviewed}</p>
              ) : (
                <ReviewForm
                  code={booking.code}
                  phone={state.phone!}
                  dict={dict}
                  defaultName={`${booking.customerName.split(" ")[0]} ${booking.customerName.split(" ")[1]?.[0] ?? ""}${booking.customerName.split(" ")[1] ? "." : ""}`.trim()}
                />
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function StatusBadge({ status, label }: { status: BookingStatus; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold",
        status === "cancelled"
          ? "bg-destructive/10 text-destructive"
          : status === "completed" || status === "ready"
            ? "bg-success/10 text-success"
            : "bg-primary/10 text-primary",
      )}
    >
      {status === "cancelled" ? <X className="size-4" /> : null}
      {label}
    </span>
  );
}
