import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { site } from "@/config/site";
import { fontClasses } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: { default: `Admin | ${site.name}`, template: `%s | Admin` },
  robots: { index: false, follow: false },
};

/** Separate root layout: the admin area is English-only and lives outside /[lang]. */
export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="en-CA" suppressHydrationWarning className={`${fontClasses} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-muted/40">
        <ThemeProvider>
          {children}
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
