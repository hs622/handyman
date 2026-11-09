import {
  Gamepad2,
  Laptop,
  Monitor,
  Smartphone,
  Tablet,
  Watch,
  Wrench,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  smartphone: Smartphone,
  laptop: Laptop,
  tablet: Tablet,
  monitor: Monitor,
  "gamepad-2": Gamepad2,
  watch: Watch,
};

/** Renders the lucide icon stored on a device category (falls back to a wrench). */
export function CategoryIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = ICONS[name] ?? Wrench;
  return <Icon {...props} />;
}
