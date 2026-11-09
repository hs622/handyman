import { MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionaries";
import { WhatsAppButton } from "./whatsapp-button";

export function HelpBox({ dict, title, text }: { dict: Dictionary; title?: string; text?: string }) {
  return (
    <div className="rounded-2xl border bg-secondary/60 p-5">
      <p className="font-semibold">{title ?? dict.help.title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{text ?? dict.help.text}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <WhatsAppButton label={dict.common.whatsapp} message={dict.common.whatsappMessage} />
        <Button asChild variant="outline" className="h-10 rounded-full px-4">
          <a href={site.smsHref}>
            <MessageSquare /> {dict.common.textUs}
          </a>
        </Button>
        <Button asChild variant="outline" className="h-10 rounded-full px-4">
          <a href={site.phoneHref}>
            <Phone /> {dict.common.callUs} {site.phone}
          </a>
        </Button>
      </div>
    </div>
  );
}
