"use client";

import { useActionState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/forms/field";
import { login, type AdminFormState } from "@/lib/actions/admin";

export function LoginForm() {
  const [state, action, pending] = useActionState<AdminFormState, FormData>(login, {});
  return (
    <form action={action} className="space-y-4">
      <Field id="password" label="Admin password" error={state.message ? [state.message] : undefined}>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          className={inputClass}
          aria-invalid={state.message ? true : undefined}
        />
      </Field>
      <Button type="submit" disabled={pending} className="h-11 w-full rounded-full">
        {pending ? <Loader2 className="animate-spin" /> : <LogIn />} Sign in
      </Button>
    </form>
  );
}
