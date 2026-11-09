"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Flips the `dark` class and remembers the choice (read by ThemeScript on the next load). */
function toggleTheme() {
  const root = document.documentElement;
  const dark = !root.classList.contains("dark");
  root.classList.toggle("dark", dark);
  root.style.colorScheme = dark ? "dark" : "light";
  try {
    localStorage.setItem("theme", dark ? "dark" : "light");
  } catch {
    // storage unavailable (private mode) — the change still applies for this page view
  }
}

export function ThemeToggle({ label }: { label: string }) {
  return (
    <Button variant="ghost" size="icon-lg" className="rounded-full" aria-label={label} onClick={toggleTheme}>
      <Sun className="hidden dark:block" />
      <Moon className="dark:hidden" />
    </Button>
  );
}
