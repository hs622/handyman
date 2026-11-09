/**
 * Canadian / North American (NANP) phone numbers.
 * Normalizes "(416) 555-0123", "416.555.0123", "+1 416 555 0123", "14165550123" → "+14165550123" (E.164).
 * Returns null when it isn't a valid 10-digit NANP number.
 */
export function normalizePhone(input: string): string | null {
  let digits = input.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  // Area code and exchange can't start with 0 or 1.
  return /^[2-9]\d{2}[2-9]\d{6}$/.test(digits) ? `+1${digits}` : null;
}

/** "+14165550123" → "(416) 555-0123" */
export function formatPhone(e164: string): string {
  const d = e164.replace(/^\+1/, "");
  return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : e164;
}
