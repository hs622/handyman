"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Laptop, PackageSearch, Smartphone, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SlideContent = { eyebrow: string; title: string; text: string; cta: string; href: string };
export type CarouselLabels = { label: string; prev: string; next: string; goTo: string; slideOf: string };

const fmt = (t: string, vars: Record<string, number>) =>
  t.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k]));

/** Visual styling per slide (content comes from the dictionary). */
const STYLES: { icon: LucideIcon; className: string }[] = [
  { icon: Laptop, className: "from-primary to-[oklch(0.35_0.14_262)]" },
  { icon: Smartphone, className: "from-[oklch(0.42_0.12_200)] to-[oklch(0.32_0.1_240)]" },
  { icon: PackageSearch, className: "from-[oklch(0.4_0.13_290)] to-[oklch(0.3_0.12_265)]" },
];

const INTERVAL_MS = 6000;

export function HeroCarousel({
  slides: content,
  labels,
}: {
  slides: SlideContent[];
  labels: CarouselLabels;
}) {
  const SLIDES = content.map((c, i) => ({ ...c, ...STYLES[i % STYLES.length] }));
  const count = SLIDES.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = useCallback((i: number) => setIndex((i + count) % count), [count]);

  useEffect(() => {
    if (paused) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => clearInterval(t);
  }, [paused, count]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label={labels.label}
      className="relative overflow-hidden rounded-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {SLIDES.map((slide, i) => {
          const Icon = slide.icon;
          return (
            <div
              key={slide.href}
              role="group"
              aria-roledescription="slide"
              aria-label={fmt(labels.slideOf, { n: i + 1, total: SLIDES.length })}
              aria-hidden={i !== index}
              className={cn(
                "relative flex min-h-[320px] w-full shrink-0 items-center bg-gradient-to-br px-7 pt-7 pb-12 text-white sm:min-h-[360px] sm:px-20 sm:py-12",
                slide.className,
              )}
            >
              <Icon
                aria-hidden
                className="absolute -right-6 -bottom-8 size-56 opacity-15 sm:right-10 sm:size-72"
                strokeWidth={1.25}
              />
              <div className="relative max-w-lg">
                <p className="text-xs font-semibold tracking-widest uppercase opacity-80">{slide.eyebrow}</p>
                <h1 className="mt-2 text-3xl leading-tight font-extrabold sm:text-4xl">{slide.title}</h1>
                <p className="mt-3 text-white/85">{slide.text}</p>
                <Button
                  asChild
                  tabIndex={i === index ? 0 : -1}
                  className="mt-6 h-11 rounded-full bg-accent px-6 font-semibold text-accent-foreground hover:bg-accent/90"
                >
                  <Link href={slide.href} tabIndex={i === index ? 0 : -1}>
                    {slide.cta}
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        aria-label={labels.prev}
        onClick={() => go(index - 1)}
        className="absolute top-1/2 left-3 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow sm:flex"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        aria-label={labels.next}
        onClick={() => go(index + 1)}
        className="absolute top-1/2 right-3 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow sm:flex"
      >
        <ChevronRight className="size-5" />
      </button>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.href}
            type="button"
            aria-label={fmt(labels.goTo, { n: i + 1 })}
            aria-current={i === index}
            onClick={() => go(i)}
            className={cn(
              "h-2 rounded-full bg-white/50 transition-all",
              i === index ? "w-6 bg-white" : "w-2",
            )}
          />
        ))}
      </div>
    </section>
  );
}
