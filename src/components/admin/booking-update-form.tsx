"use client";

import { useActionState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/forms/field";
import { BOOKING_STATUSES, type BookingStatus } from "@/db/schema";
import { updateBooking, type AdminFormState } from "@/lib/actions/admin";
import { cn } from "@/lib/utils";
import { ADMIN_STATUS_LABEL } from "./status-badge";

export function BookingUpdateForm({
  bookingId,
  status,
  quoteCents,
  adminNotes,
}: {
  bookingId: string;
  status: BookingStatus;
  quoteCents: number | null;
  adminNotes: string | null;
}) {
  const [state, action, pending] = useActionState<AdminFormState, FormData>(
    updateBooking.bind(null, bookingId),
    {},
  );

  useEffect(() => {
    if (state.message) (state.ok ? toast.success : toast.error)(state.message);
  }, [state]);

  return (
    <form action={action} className="space-y-4">
      <Field id="status" label="Status">
        <select id="status" name="status" defaultValue={status} key={status} className={inputClass}>
          {BOOKING_STATUSES.map((s) => (
            <option key={s} value={s}>
              {ADMIN_STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </Field>
      <Field
        id="quote"
        label="Quote (CAD, before HST)"
        optional="(optional)"
        hint="Shown to the customer with 13% HST added."
      >
        <div className="relative">
          <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-muted-foreground">
            $
          </span>
          <input
            id="quote"
            name="quote"
            inputMode="decimal"
            placeholder="165.00"
            defaultValue={quoteCents !== null ? (quoteCents / 100).toFixed(2) : ""}
            key={`q-${quoteCents}`}
            className={cn(inputClass, "pl-7")}
          />
        </div>
      </Field>
      <Field
        id="note"
        label="Update note for customer"
        optional="(optional)"
        hint="Added to the public timeline as written — use the customer's language (see EN/FR badge)."
      >
        <input id="note" name="note" maxLength={500} className={inputClass} key={`n-${state.ok}-${status}`} />
      </Field>
      <Field id="adminNotes" label="Internal notes" optional="(optional)" hint="Never shown to the customer.">
        <textarea
          id="adminNotes"
          name="adminNotes"
          rows={3}
          defaultValue={adminNotes ?? ""}
          className={cn(inputClass, "h-auto py-3")}
        />
      </Field>
      <Button type="submit" disabled={pending} className="h-10 rounded-full px-5">
        {pending ? <Loader2 className="animate-spin" /> : <Save />} Save changes
      </Button>
    </form>
  );
}
