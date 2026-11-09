/** Replace {placeholders}: fill("Hi {name}", { name: "Sam" }) → "Hi Sam". */
export function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (m, key: string) => (key in vars ? String(vars[key]) : m));
}
