import { randomInt } from "node:crypto";

// No 0/O, 1/I/L — easy to read over the phone.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/** e.g. "TR-7K3Q9P" */
export function generateBookingCode(): string {
  let code = "";
  for (let i = 0; i < 6; i++) code += ALPHABET[randomInt(ALPHABET.length)];
  return `TR-${code}`;
}

/** Uppercase, trim and re-insert the dash so "tr7k3q9p" matches "TR-7K3Q9P". */
export function normalizeBookingCode(input: string): string {
  const raw = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const body = raw.startsWith("TR") ? raw.slice(2) : raw;
  return `TR-${body}`;
}
