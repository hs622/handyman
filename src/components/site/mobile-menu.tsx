"use client";

import { useState } from "react";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NavLinks, type NavItem } from "./nav-links";

export function MobileMenu({
  items,
  title,
  callHref,
  callLabel,
  openLabel,
  children,
}: {
  items: NavItem[];
  title: string;
  callHref: string;
  callLabel: string;
  openLabel: string;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-lg" className="rounded-full md:hidden" aria-label={openLabel}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4">
          <NavLinks items={items} className="flex flex-col gap-1" onNavigate={() => setOpen(false)} />
          <Button asChild className="h-11 rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
            <a href={callHref}>
              <Phone /> {callLabel}
            </a>
          </Button>
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
