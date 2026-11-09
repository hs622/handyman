import Link from "next/link";
import { Wrench } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";
import { site } from "@/config/site";

export const metadata = { title: "Sign in" };

export default function AdminLoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-3xl border bg-card p-8 shadow-sm">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="inline-flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Wrench className="size-5" />
          </span>
          {site.name}
        </Link>
        <h1 className="mt-6 text-xl font-bold">Admin sign in</h1>
        <p className="mb-6 text-sm text-muted-foreground">Manage bookings, reviews and services.</p>
        <LoginForm />
      </div>
    </div>
  );
}
