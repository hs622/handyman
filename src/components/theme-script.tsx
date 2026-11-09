/**
 * Sets the `dark` class before first paint, from the saved choice or the OS setting.
 * Rendered by the (server) root layout, so React never renders a <script> on the client.
 */
const script = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light"}catch(e){}})()`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
