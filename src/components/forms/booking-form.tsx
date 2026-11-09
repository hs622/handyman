"use client";

import { useActionState, useState } from "react";
import { Loader2, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryIcon } from "@/components/site/category-icon";
import { TIME_SLOTS, type DeviceCategory } from "@/db/schema";
import { pick, type Locale } from "@/i18n/config";
import type { Dictionary, ErrorKey } from "@/i18n/dictionaries";
import { createBooking, type BookingFormState } from "@/lib/actions/booking";
import { formatMoney } from "@/lib/format";
import type { ServiceWithCategory } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { Field, errorProps, inputClass } from "./field";

export function BookingForm({
  lang,
  dict,
  categories,
  services,
  initialServiceId,
  minDate,
}: {
  lang: Locale;
  dict: Pick<Dictionary, "book" | "errors" | "slot" | "common">;
  categories: DeviceCategory[];
  services: ServiceWithCategory[];
  initialServiceId?: number;
  minDate: string;
}) {
  const t = dict.book.form;
  const [state, action, pending] = useActionState<BookingFormState, FormData>(createBooking, {});
  const initialService = services.find((s) => s.id === initialServiceId);
  const [categoryId, setCategoryId] = useState<string>(
    state.values?.categoryId ?? (initialService ? String(initialService.categoryId) : ""),
  );
  const v = state.values ?? {};
  /** Translate error keys for a field. */
  const err = (field: string) => state.errors?.[field]?.map((k: ErrorKey) => dict.errors[k] ?? k);
  const categoryServices = services.filter((s) => String(s.categoryId) === categoryId);

  return (
    <form action={action} noValidate className="space-y-8">
      <input type="hidden" name="lang" value={lang} />
      {state.message && (
        <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {dict.errors[state.message]}
        </p>
      )}

      {/* Honeypot (hidden from humans) */}
      <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
        <label>
          {t.company} <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <fieldset className="space-y-4">
        <legend className="mb-3 text-lg font-semibold">{t.device}</legend>
        <div>
          <p className="mb-2 text-sm font-medium" id="category-label">
            {t.deviceType}
          </p>
          <div
            role="radiogroup"
            aria-labelledby="category-label"
            className="grid grid-cols-2 gap-2 sm:grid-cols-3"
          >
            {categories.map((c) => (
              <label
                key={c.id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border bg-background p-3 text-sm font-medium transition has-focus-visible:ring-3 has-focus-visible:ring-ring/40",
                  String(c.id) === categoryId ? "border-primary bg-primary/5 text-primary" : "hover:bg-muted",
                )}
              >
                <input
                  type="radio"
                  name="categoryId"
                  value={c.id}
                  checked={String(c.id) === categoryId}
                  onChange={() => setCategoryId(String(c.id))}
                  className="sr-only"
                />
                <CategoryIcon name={c.icon} className="size-5 shrink-0" /> {pick(c, "name", lang)}
              </label>
            ))}
          </div>
          {err("categoryId") && <p className="mt-1.5 text-sm text-destructive">{err("categoryId")![0]}</p>}
        </div>

        <Field
          id="serviceId"
          label={t.repair}
          optional={t.optional}
          error={err("serviceId")}
          hint={t.repairHint}
        >
          <select
            id="serviceId"
            name="serviceId"
            key={categoryId}
            defaultValue={
              v.serviceId ??
              (initialService && String(initialService.categoryId) === categoryId
                ? String(initialService.id)
                : "")
            }
            disabled={!categoryId}
            className={inputClass}
            {...errorProps("serviceId", err("serviceId"))}
          >
            <option value="">{categoryId ? t.notSure : t.chooseDeviceFirst}</option>
            {categoryServices.map((s) => (
              <option key={s.id} value={s.id}>
                {pick(s, "name", lang)} — {dict.common.from}{" "}
                {formatMoney(s.priceFromCents, lang, { compact: true })}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="deviceBrand" label={t.brand} error={err("deviceBrand")}>
            <input
              id="deviceBrand"
              name="deviceBrand"
              defaultValue={v.deviceBrand}
              placeholder={t.brandPlaceholder}
              className={inputClass}
              {...errorProps("deviceBrand", err("deviceBrand"))}
            />
          </Field>
          <Field id="deviceModel" label={t.model} error={err("deviceModel")}>
            <input
              id="deviceModel"
              name="deviceModel"
              defaultValue={v.deviceModel}
              placeholder={t.modelPlaceholder}
              className={inputClass}
              {...errorProps("deviceModel", err("deviceModel"))}
            />
          </Field>
        </div>
        <Field id="issue" label={t.issue} error={err("issue")}>
          <textarea
            id="issue"
            name="issue"
            rows={4}
            defaultValue={v.issue}
            placeholder={t.issuePlaceholder}
            className={cn(inputClass, "h-auto py-3")}
            {...errorProps("issue", err("issue"))}
          />
        </Field>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-3 text-lg font-semibold">{t.dropoff}</legend>
        <Field id="preferredDate" label={t.date} error={err("preferredDate")}>
          <input
            id="preferredDate"
            name="preferredDate"
            type="date"
            lang={lang === "fr" ? "fr-CA" : "en-CA"}
            min={minDate}
            defaultValue={v.preferredDate ?? minDate}
            className={cn(inputClass, "sm:max-w-xs")}
            {...errorProps("preferredDate", err("preferredDate"))}
          />
        </Field>
        <div>
          <p className="mb-2 text-sm font-medium" id="slot-label">
            {t.slot}
          </p>
          <div role="radiogroup" aria-labelledby="slot-label" className="grid gap-2 sm:grid-cols-3">
            {TIME_SLOTS.map((value) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-3 rounded-xl border bg-background p-3 text-sm transition hover:bg-muted has-checked:border-primary has-checked:bg-primary/5 has-checked:text-primary has-focus-visible:ring-3 has-focus-visible:ring-ring/40"
              >
                <input
                  type="radio"
                  name="preferredSlot"
                  value={value}
                  defaultChecked={(v.preferredSlot ?? "morning") === value}
                  className="accent-primary"
                />
                {dict.slot[value]}
              </label>
            ))}
          </div>
          {err("preferredSlot") && (
            <p className="mt-1.5 text-sm text-destructive">{err("preferredSlot")![0]}</p>
          )}
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-3 text-lg font-semibold">{t.details}</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="customerName" label={t.name} error={err("customerName")}>
            <input
              id="customerName"
              name="customerName"
              autoComplete="name"
              defaultValue={v.customerName}
              className={inputClass}
              {...errorProps("customerName", err("customerName"))}
            />
          </Field>
          <Field id="phone" label={t.phone} error={err("phone")} hint={t.phoneHint}>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder={t.phonePlaceholder}
              defaultValue={v.phone}
              className={inputClass}
              {...errorProps("phone", err("phone"))}
            />
          </Field>
        </div>
        <Field id="email" label={t.email} optional={t.optional} error={err("email")}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={v.email}
            className={cn(inputClass, "sm:max-w-md")}
            {...errorProps("email", err("email"))}
          />
        </Field>
      </fieldset>

      <Button
        type="submit"
        disabled={pending}
        className="h-12 w-full rounded-full bg-accent text-base font-semibold text-accent-foreground hover:bg-accent/90 sm:w-auto sm:px-8"
      >
        {pending ? <Loader2 className="animate-spin" /> : <Wrench />}
        {pending ? t.submitting : t.submit}
      </Button>
    </form>
  );
}
