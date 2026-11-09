"use client";

import { useActionState, useState } from "react";
import { CheckCircle2, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Dictionary, ErrorKey } from "@/i18n/dictionaries";
import { submitReview, type ReviewFormState } from "@/lib/actions/review";
import { cn } from "@/lib/utils";
import { Field, errorProps, inputClass } from "./field";

export function ReviewForm({
  code,
  phone,
  defaultName,
  dict,
}: {
  code: string;
  phone: string;
  defaultName: string;
  dict: Pick<Dictionary, "review" | "errors">;
}) {
  const t = dict.review;
  const [state, action, pending] = useActionState<ReviewFormState, FormData>(submitReview, {});
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const err = (field: string) => state.errors?.[field]?.map((k: ErrorKey) => dict.errors[k] ?? k);

  if (state.ok) {
    return (
      <div className="flex items-start gap-3 rounded-2xl bg-success/10 p-5 text-success">
        <CheckCircle2 className="size-6 shrink-0" />
        <div>
          <p className="font-semibold">{dict.errors.reviewLive}</p>
          <p className="text-sm opacity-80">{t.thanks}</p>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="code" value={code} />
      <input type="hidden" name="phone" value={phone} />
      <input type="hidden" name="rating" value={rating || ""} />
      {state.message && (
        <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {dict.errors[state.message]}
        </p>
      )}
      <div>
        <p className="mb-2 text-sm font-medium" id="rating-label">
          {t.rating}
        </p>
        <div
          role="radiogroup"
          aria-labelledby="rating-label"
          className="flex gap-1"
          onMouseLeave={() => setHover(0)}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={n === 1 ? t.star : t.stars.replace("{n}", String(n))}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              className="rounded-md p-1 outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
            >
              <Star
                className={cn(
                  "size-8 transition",
                  n <= (hover || rating) ? "fill-accent text-accent" : "text-muted-foreground/40",
                )}
              />
            </button>
          ))}
        </div>
        {err("rating") && <p className="mt-1.5 text-sm text-destructive">{err("rating")![0]}</p>}
      </div>
      <Field id="displayName" label={t.name} error={err("displayName")} hint={t.nameHint}>
        <input
          id="displayName"
          name="displayName"
          defaultValue={defaultName}
          className={cn(inputClass, "sm:max-w-xs")}
          {...errorProps("displayName", err("displayName"))}
        />
      </Field>
      <Field id="body" label={t.body} error={err("body")}>
        <textarea
          id="body"
          name="body"
          rows={4}
          placeholder={t.bodyPlaceholder}
          className={cn(inputClass, "h-auto py-3")}
          {...errorProps("body", err("body"))}
        />
      </Field>
      <Button type="submit" disabled={pending} className="h-11 rounded-full px-6">
        {pending && <Loader2 className="animate-spin" />} {t.submit}
      </Button>
    </form>
  );
}
