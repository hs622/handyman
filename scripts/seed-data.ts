import type { BookingStatus, TimeSlot } from "../src/db/schema";

export const categories = [
  { slug: "phones", name: "Phones", nameFr: "Téléphones", icon: "smartphone", sort: 1 },
  { slug: "laptops", name: "Laptops", nameFr: "Portables", icon: "laptop", sort: 2 },
  { slug: "tablets", name: "Tablets", nameFr: "Tablettes", icon: "tablet", sort: 3 },
  { slug: "desktops", name: "Desktops & PCs", nameFr: "Ordinateurs de bureau", icon: "monitor", sort: 4 },
  { slug: "consoles", name: "Game Consoles", nameFr: "Consoles de jeu", icon: "gamepad-2", sort: 5 },
  { slug: "smartwatches", name: "Smartwatches", nameFr: "Montres intelligentes", icon: "watch", sort: 6 },
] as const;

type CategorySlug = (typeof categories)[number]["slug"];

/** Starting prices in CAD cents, before HST. */
export const services: {
  slug: string;
  category: CategorySlug;
  name: string;
  nameFr: string;
  description: string;
  descriptionFr: string;
  priceFromCents: number;
  turnaround: string;
  turnaroundFr: string;
  sort: number;
}[] = [
  {
    slug: "phone-screen-replacement",
    category: "phones",
    name: "Screen replacement",
    nameFr: "Remplacement d'écran",
    description:
      "Cracked glass, dead pixels or unresponsive touch. We fit quality OLED/LCD panels and test every function before handover.",
    descriptionFr:
      "Vitre fissurée, pixels morts ou tactile qui ne répond plus. Écrans OLED/LCD de qualité, chaque fonction testée avant la remise.",
    priceFromCents: 14900,
    turnaround: "1–2 hours",
    turnaroundFr: "1 à 2 heures",
    sort: 1,
  },
  {
    slug: "phone-battery-replacement",
    category: "phones",
    name: "Battery replacement",
    nameFr: "Remplacement de batterie",
    description:
      "Phone dying by afternoon or shutting down at 20%? We replace worn batteries and calibrate charging.",
    descriptionFr:
      "Téléphone à plat dès l'après-midi ou qui s'éteint à 20 %? On remplace la batterie usée et on calibre la recharge.",
    priceFromCents: 8900,
    turnaround: "45 minutes",
    turnaroundFr: "45 minutes",
    sort: 2,
  },
  {
    slug: "phone-charging-port",
    category: "phones",
    name: "Charging port repair",
    nameFr: "Réparation du port de recharge",
    description: "Loose cable, slow charging or no charging at all. Port cleaning or full replacement.",
    descriptionFr:
      "Câble lâche, recharge lente ou aucune recharge. Nettoyage ou remplacement complet du port.",
    priceFromCents: 7900,
    turnaround: "1 hour",
    turnaroundFr: "1 heure",
    sort: 3,
  },
  {
    slug: "phone-water-damage",
    category: "phones",
    name: "Water damage treatment",
    nameFr: "Traitement des dégâts d'eau",
    description:
      "Ultrasonic cleaning and board-level inspection to recover devices after spills, rain or a dip in the lake.",
    descriptionFr:
      "Nettoyage aux ultrasons et inspection de la carte mère pour récupérer votre appareil après un dégât d'eau.",
    priceFromCents: 9900,
    turnaround: "1–2 days",
    turnaroundFr: "1 à 2 jours",
    sort: 4,
  },
  {
    slug: "phone-camera-repair",
    category: "phones",
    name: "Camera repair",
    nameFr: "Réparation de caméra",
    description: "Blurry photos, cracked lens or camera not opening. Lens and module replacement.",
    descriptionFr:
      "Photos floues, lentille fissurée ou caméra qui ne s'ouvre pas. Remplacement de la lentille ou du module.",
    priceFromCents: 8900,
    turnaround: "1–2 hours",
    turnaroundFr: "1 à 2 heures",
    sort: 5,
  },
  {
    slug: "laptop-screen-replacement",
    category: "laptops",
    name: "Laptop screen replacement",
    nameFr: "Remplacement d'écran de portable",
    description: "Broken or flickering display panels replaced with matching resolution and refresh rate.",
    descriptionFr: "Écran brisé ou qui scintille remplacé par un panneau de même résolution et fréquence.",
    priceFromCents: 19900,
    turnaround: "Same day",
    turnaroundFr: "Le jour même",
    sort: 1,
  },
  {
    slug: "laptop-keyboard-replacement",
    category: "laptops",
    name: "Keyboard replacement",
    nameFr: "Remplacement de clavier",
    description: "Sticky, missing or dead keys. Full keyboard swap for most brands.",
    descriptionFr:
      "Touches collantes, manquantes ou mortes. Remplacement complet du clavier pour la plupart des marques.",
    priceFromCents: 12900,
    turnaround: "Same day",
    turnaroundFr: "Le jour même",
    sort: 2,
  },
  {
    slug: "laptop-ssd-upgrade",
    category: "laptops",
    name: "SSD upgrade + OS install",
    nameFr: "Mise à niveau SSD + installation du système",
    description:
      "Make an old laptop feel new: SSD fitted, Windows or macOS installed and your data migrated.",
    descriptionFr:
      "Donnez une seconde vie à votre portable : SSD installé, Windows ou macOS installé et données transférées.",
    priceFromCents: 17900,
    turnaround: "3–4 hours",
    turnaroundFr: "3 à 4 heures",
    sort: 3,
  },
  {
    slug: "laptop-overheating",
    category: "laptops",
    name: "Overheating & fan service",
    nameFr: "Surchauffe et ventilateur",
    description: "Deep cleaning, fresh thermal paste and fan replacement if needed.",
    descriptionFr:
      "Nettoyage en profondeur, nouvelle pâte thermique et remplacement du ventilateur au besoin.",
    priceFromCents: 8900,
    turnaround: "2–3 hours",
    turnaroundFr: "2 à 3 heures",
    sort: 4,
  },
  {
    slug: "virus-removal",
    category: "laptops",
    name: "Virus & malware cleanup",
    nameFr: "Nettoyage virus et logiciels malveillants",
    description: "Remove malware, pop-ups and slowdowns, then harden your system.",
    descriptionFr:
      "Suppression des logiciels malveillants, fenêtres publicitaires et ralentissements, puis sécurisation du système.",
    priceFromCents: 7900,
    turnaround: "2 hours",
    turnaroundFr: "2 heures",
    sort: 5,
  },
  {
    slug: "tablet-screen-replacement",
    category: "tablets",
    name: "Tablet screen replacement",
    nameFr: "Remplacement d'écran de tablette",
    description: "iPad and Android tablet glass and display replacement.",
    descriptionFr: "Remplacement de la vitre et de l'écran d'iPad et de tablettes Android.",
    priceFromCents: 16900,
    turnaround: "Same day",
    turnaroundFr: "Le jour même",
    sort: 1,
  },
  {
    slug: "pc-diagnostics",
    category: "desktops",
    name: "PC diagnostics & repair",
    nameFr: "Diagnostic et réparation d'ordinateur",
    description: "No power, blue screens or random restarts. Full hardware diagnosis with a written quote.",
    descriptionFr:
      "Aucun démarrage, écrans bleus ou redémarrages aléatoires. Diagnostic matériel complet avec soumission écrite.",
    priceFromCents: 4900,
    turnaround: "1 day",
    turnaroundFr: "1 jour",
    sort: 1,
  },
  {
    slug: "pc-custom-build",
    category: "desktops",
    name: "Custom PC assembly",
    nameFr: "Assemblage d'ordinateur sur mesure",
    description: "Bring your parts or let us source them. Assembly, cable management and stress testing.",
    descriptionFr:
      "Apportez vos pièces ou laissez-nous les trouver. Assemblage, gestion des câbles et tests de charge.",
    priceFromCents: 14900,
    turnaround: "1–2 days",
    turnaroundFr: "1 à 2 jours",
    sort: 2,
  },
  {
    slug: "console-hdmi-port",
    category: "consoles",
    name: "Console HDMI port repair",
    nameFr: "Réparation du port HDMI de console",
    description: "No picture on PS5, Xbox or Switch dock? We micro-solder replacement HDMI ports.",
    descriptionFr: "Aucune image sur PS5, Xbox ou station Switch? On remplace le port HDMI par microsoudure.",
    priceFromCents: 14900,
    turnaround: "1–2 days",
    turnaroundFr: "1 à 2 jours",
    sort: 1,
  },
  {
    slug: "console-cleaning",
    category: "consoles",
    name: "Console cleaning & thermal service",
    nameFr: "Nettoyage et entretien thermique de console",
    description: "Loud fans and overheating fixed with a full teardown clean.",
    descriptionFr: "Ventilateurs bruyants et surchauffe réglés par un démontage et nettoyage complets.",
    priceFromCents: 8900,
    turnaround: "Same day",
    turnaroundFr: "Le jour même",
    sort: 2,
  },
  {
    slug: "smartwatch-battery",
    category: "smartwatches",
    name: "Smartwatch battery & glass",
    nameFr: "Batterie et vitre de montre intelligente",
    description: "Battery and cover glass replacement for popular smartwatches.",
    descriptionFr: "Remplacement de la batterie et de la vitre des montres intelligentes populaires.",
    priceFromCents: 9900,
    turnaround: "1 day",
    turnaroundFr: "1 jour",
    sort: 1,
  },
];

/**
 * Demo data — only seeded when SEED_DEMO=true (preview/local).
 * Phone numbers use the 555-01xx range reserved for fictional use.
 */
export const demoBookings: {
  code: string;
  customerName: string;
  phone: string;
  locale: "en" | "fr";
  service: string;
  deviceBrand: string;
  deviceModel: string;
  issue: string;
  daysAgo: number;
  slot: TimeSlot;
  status: BookingStatus;
  quoteCents?: number;
  review?: { rating: number; body: string; displayName: string };
}[] = [
  {
    code: "TR-DEMO2A",
    customerName: "Emily Chen",
    phone: "+14165550142",
    locale: "en",
    service: "phone-screen-replacement",
    deviceBrand: "Apple",
    deviceModel: "iPhone 14",
    issue: "Screen cracked after a drop, touch still works.",
    daysAgo: 12,
    slot: "morning",
    status: "completed",
    quoteCents: 22900,
    review: {
      rating: 5,
      body: "Screen replaced in about an hour and it looks original. Clear pricing upfront.",
      displayName: "Emily C.",
    },
  },
  {
    code: "TR-DEMO3B",
    customerName: "Marc-André Tremblay",
    phone: "+16475550188",
    locale: "fr",
    service: "laptop-ssd-upgrade",
    deviceBrand: "Dell",
    deviceModel: "XPS 13",
    issue: "Démarrage très lent, je veux un SSD et Windows réinstallé.",
    daysAgo: 9,
    slot: "afternoon",
    status: "completed",
    quoteCents: 21900,
    review: {
      rating: 5,
      body: "Mon portable démarre en quelques secondes. Ils ont aussi transféré tous mes fichiers. Je recommande!",
      displayName: "Marc-André T.",
    },
  },
  {
    code: "TR-DEMO4C",
    customerName: "Priya Patel",
    phone: "+14375550119",
    locale: "en",
    service: "console-hdmi-port",
    deviceBrand: "Sony",
    deviceModel: "PS5",
    issue: "No display on TV, HDMI port looks bent.",
    daysAgo: 7,
    slot: "evening",
    status: "completed",
    quoteCents: 16900,
    review: {
      rating: 4,
      body: "Took two days but the PS5 works perfectly. Kept me updated throughout.",
      displayName: "Priya P.",
    },
  },
  {
    code: "TR-DEMO5D",
    customerName: "Jordan Smith",
    phone: "+14165550177",
    locale: "en",
    service: "phone-battery-replacement",
    deviceBrand: "Samsung",
    deviceModel: "Galaxy S23",
    issue: "Battery drains by noon.",
    daysAgo: 2,
    slot: "morning",
    status: "repairing",
    quoteCents: 10900,
  },
  {
    code: "TR-DEMO6E",
    customerName: "Sophie Gagnon",
    phone: "+16475550133",
    locale: "fr",
    service: "laptop-keyboard-replacement",
    deviceBrand: "HP",
    deviceModel: "Pavilion 14",
    issue: "Plusieurs touches ne fonctionnent plus après un dégât de café.",
    daysAgo: 1,
    slot: "afternoon",
    status: "diagnosing",
  },
  {
    code: "TR-DEMO7F",
    customerName: "Daniel Okafor",
    phone: "+14165550161",
    locale: "en",
    service: "pc-diagnostics",
    deviceBrand: "Custom",
    deviceModel: "Ryzen 7 build",
    issue: "Random restarts while gaming.",
    daysAgo: 0,
    slot: "evening",
    status: "pending",
  },
];
