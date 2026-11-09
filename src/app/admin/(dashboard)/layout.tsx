import Link from "next/link";
import { Suspense } from "react";
import { ExternalLink, LogOut, Wrench } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions/admin";

export default function AdminDashboardLayout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-background">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
          <Link href="/admin" className="flex shrink-0 items-center gap-2 font-bold">
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Wrench className="size-4" />
            </span>
            <span className="hidden sm:inline">Admin</span>
          </Link>
          {/* usePathname() on dynamic [id] routes must stream in behind a boundary */}
          <Suspense fallback={<div className="h-8 flex-1" />}>
            <AdminNav />
          </Suspense>
          <div className="ml-auto flex items-center gap-1">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/" target="_blank">
                View site <ExternalLink />
              </Link>
            </Button>
            <form action={logout}>
              <Button type="submit" variant="ghost" size="sm" aria-label="Sign out">
                <LogOut /> <span className="hidden sm:inline">Sign out</span>
              </Button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">{children}</div>
    </>
  );
}
