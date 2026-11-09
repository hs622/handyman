import type { BookingStatus } from "@/db/schema";
import { dictionaryFor } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";

/** Admin is English-only. */
export const ADMIN_STATUS_LABEL = dictionaryFor("en").status;
export const ADMIN_SLOT_LABEL = dictionaryFor("en").slot;

const TONE: Record<BookingStatus, string> = {
  pending: "bg-accent/25 text-accent-foreground dark:text-accent",
  confirmed: "bg-primary/10 text-primary",
  received: "bg-primary/10 text-primary",
  diagnosing: "bg-primary/10 text-primary",
  repairing: "bg-primary/10 text-primary",
  ready: "bg-success/15 text-success",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

export function AdminStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        TONE[status],
      )}
    >
      {ADMIN_STATUS_LABEL[status]}
    </span>
  );
}

export function LocaleBadge({ locale }: { locale: "en" | "fr" }) {
  return (
    <span
      title={locale === "fr" ? "Booked in French — contact in French" : "Booked in English"}
      className="inline-flex rounded-md border px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase"
    >
      {locale}
    </span>
  );
}
