"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CopyCode({ code, label, copied }: { code: string; label: string; copied: string }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="mt-2"
      onClick={async () => {
        await navigator.clipboard.writeText(code);
        toast.success(copied);
      }}
    >
      <Copy /> {label}
    </Button>
  );
}
