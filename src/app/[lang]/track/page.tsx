import type { Metadata } from "next";
import { PackageSearch } from "lucide-react";
import { TrackPanel } from "@/components/forms/track-panel";
import { HelpBox } from "@/components/site/help-box";
import { alternates } from "@/i18n/metadata";
import { getDictionary } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { lang, dict } = await getDictionary();
  return {
    title: dict.track.metaTitle,
    description: dict.track.metaDescription,
    alternates: alternates(lang, "/track"),
  };
}

export default async function TrackPage() {
  const { lang, dict } = await getDictionary();
  const { track, status, statusHint, slotShort, errors, review, common, book } = dict;
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-start gap-4">
        <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
          <PackageSearch className="size-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{track.title}</h1>
          <p className="mt-1 text-muted-foreground">{track.intro}</p>
        </div>
      </div>
      <TrackPanel lang={lang} dict={{ track, status, statusHint, slotShort, errors, review, common, book }} />
      <div className="mt-8">
        <HelpBox dict={dict} title={track.lostCode} text={track.lostCodeText} />
      </div>
    </div>
  );
}
