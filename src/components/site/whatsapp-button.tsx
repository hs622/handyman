import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappHref } from "@/lib/contact";
import { cn } from "@/lib/utils";

/** WhatsApp-green button that opens a chat with the shop (new tab on desktop, the app on phones). */
export function WhatsAppButton({
  label,
  message,
  className,
}: {
  label: string;
  message?: string;
  className?: string;
}) {
  return (
    <Button
      asChild
      className={cn(
        "h-10 rounded-full bg-[#128C7E] px-4 text-white hover:bg-[#0f766a] dark:bg-[#128C7E]",
        className,
      )}
    >
      <a href={whatsappHref(message)} target="_blank" rel="noreferrer">
        <MessageCircle /> {label}
      </a>
    </Button>
  );
}
