"use client";

import { useActionState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateService, type AdminFormState } from "@/lib/actions/admin";
import { cn } from "@/lib/utils";

type Row = {
  id: number;
  name: string;
  slug: string;
  category: string;
  priceFromCents: number;
  turnaround: string;
  turnaroundFr: string;
  isActive: boolean;
};

export const SERVICE_GRID = "sm:grid-cols-[1fr_110px_130px_130px_80px_auto]";

const cellInput =
  "h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 dark:bg-input/30";

export function ServiceRowForm({ service }: { service: Row }) {
  const [state, action, pending] = useActionState<AdminFormState, FormData>(
    updateService.bind(null, service.id),
    {},
  );
  useEffect(() => {
    if (state.message) (state.ok ? toast.success : toast.error)(`${service.name}: ${state.message}`);
  }, [state, service.name]);

  return (
    <form
      action={action}
      className={cn("grid gap-3 p-4 sm:items-center", SERVICE_GRID, !service.isActive && "opacity-60")}
    >
      <div>
        <p className="font-medium">{service.name}</p>
        <p className="text-xs text-muted-foreground">{service.category}</p>
      </div>
      <label className="text-xs text-muted-foreground">
        <span className="sm:sr-only">From (CAD)</span>
        <span className="relative block">
          <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-sm">$</span>
          <input
            name="price"
            inputMode="decimal"
            defaultValue={(service.priceFromCents / 100).toFixed(2)}
            className={cn(cellInput, "pl-6")}
            aria-label={`${service.name} starting price in dollars`}
          />
        </span>
      </label>
      <label className="text-xs text-muted-foreground">
        <span className="sm:sr-only">Turnaround (EN)</span>
        <input
          name="turnaround"
          defaultValue={service.turnaround}
          className={cellInput}
          aria-label={`${service.name} turnaround (English)`}
        />
      </label>
      <label className="text-xs text-muted-foreground">
        <span className="sm:sr-only">Turnaround (FR)</span>
        <input
          name="turnaroundFr"
          defaultValue={service.turnaroundFr}
          className={cellInput}
          aria-label={`${service.name} turnaround (French)`}
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          name="isActive"
          type="checkbox"
          defaultChecked={service.isActive}
          className="size-4 accent-primary"
        />
        Active
      </label>
      <Button type="submit" size="sm" variant="outline" disabled={pending} className="rounded-full">
        {pending ? <Loader2 className="animate-spin" /> : <Save />} Save
      </Button>
    </form>
  );
}
