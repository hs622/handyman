import { Suspense } from "react";
import { AdminPageSkeleton } from "@/components/admin/page-skeleton";
import { SERVICE_GRID, ServiceRowForm } from "@/components/admin/service-row-form";
import { requireAdmin } from "@/lib/admin-auth";
import { listAllServices } from "@/lib/admin-queries";
import { cn } from "@/lib/utils";

export const metadata = { title: "Services" };

export default function AdminServicesPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <ServicesList />
    </Suspense>
  );
}

async function ServicesList() {
  await requireAdmin();
  const services = await listAllServices();
  return (
    <div>
      <h1 className="text-2xl font-bold">Services & prices</h1>
      <p className="text-sm text-muted-foreground">
        Starting prices in CAD before HST, shown on both the English and French site. Inactive services are
        hidden from customers.
      </p>
      <div className="mt-6 divide-y rounded-2xl border bg-card">
        <div
          className={cn(
            "hidden gap-3 bg-muted/50 px-4 py-3 text-xs font-semibold text-muted-foreground uppercase sm:grid",
            SERVICE_GRID,
          )}
        >
          <span>Service</span>
          <span>From (CAD)</span>
          <span>Turnaround EN</span>
          <span>Turnaround FR</span>
          <span>Visible</span>
          <span className="w-[74px]" />
        </div>
        {services.map((s) => (
          <ServiceRowForm key={s.id} service={s} />
        ))}
      </div>
    </div>
  );
}
