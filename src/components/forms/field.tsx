import { cn } from "@/lib/utils";

export const inputClass =
  "h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 aria-invalid:border-destructive aria-invalid:ring-destructive/20 disabled:opacity-50 dark:bg-input/30";

export function Field({
  id,
  label,
  hint,
  error,
  optional,
  children,
  className,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string[];
  /** Text shown after the label, e.g. "(optional)". */
  optional?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label} {optional && <span className="font-normal text-muted-foreground">{optional}</span>}
      </label>
      {children}
      {error?.length ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error[0]}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

/** aria props wiring an input to its Field error message. */
export const errorProps = (id: string, error?: string[]) =>
  error?.length ? { "aria-invalid": true, "aria-describedby": `${id}-error` } : {};
