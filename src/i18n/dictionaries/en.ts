/**
 * English (Canada) strings. `fr.ts` must match this shape (enforced by the `Dictionary` type).
 * Use {placeholders} with `fill()` from "@/i18n/fill" — dictionaries must stay plain data so they
 * can be passed to Client Components.
 */
const en = {
  meta: {
    tagline: "Phones, laptops & consoles — fixed by experts.",
    description:
      "Walk-in tech repair in Toronto for phones, laptops, tablets, PCs and game consoles. Free diagnosis, upfront prices and a 90-day warranty.",
  },
  common: {
    callToBook: "Call to book",
    call: "Call",
    from: "from",
    startingFrom: "Starting from",
    viewDetails: "View details",
    allServices: "All services",
    callUs: "Call",
    textUs: "Text us",
    whatsapp: "WhatsApp",
    whatsappMessage: "Hi! I'd like to book a repair.",
    whatsappServiceMessage: "Hi! I'd like to book: {service}.",
    getDirections: "Get directions",
    language: "Language",
    toggleTheme: "Toggle dark mode",
    openMenu: "Open menu",
    taxName: "HST",
    pricesNote: "Prices in CAD, before {tax}.",
    plusTax: "+ {tax}",
  },
  nav: { home: "Home", services: "Services", reviews: "Reviews" },
  header: {
    banner: "🔧 Free diagnosis on every walk-in · {days}-day warranty on all repairs",
    search: "Search repairs — screen, battery, SSD…",
    searchLabel: "Search repairs",
  },
  footer: {
    explore: "Explore",
    visit: "Visit us",
    contact: "Contact",
    warranty: "{days}-day warranty on parts and labour.",
  },
  help: {
    title: "Need help?",
    text: "Not sure what's wrong? Message us on WhatsApp, text or call — we'll guide you.",
  },
  home: {
    slides: [
      {
        eyebrow: "Walk-in tech repair",
        title: "Broken device? We'll fix it fast.",
        text: "Phones, laptops, tablets and consoles repaired by certified technicians — with a free diagnosis.",
        cta: "Call to book",
      },
      {
        eyebrow: "Same-day service",
        title: "Cracked screen? Fixed in about an hour.",
        text: "Quality replacement panels for iPhone, Samsung, Google Pixel and more. Drop off today, pick up today.",
        cta: "See phone repairs",
      },
      {
        eyebrow: "Questions?",
        title: "Not sure what's wrong? Text us.",
        text: "Send a photo or describe the problem on WhatsApp — we'll reply with an estimate.",
        cta: "Message us on WhatsApp",
      },
    ],
    carousel: {
      label: "Highlights",
      prev: "Previous slide",
      next: "Next slide",
      goTo: "Go to slide {n}",
      slideOf: "{n} of {total}",
    },
    visit: { eyebrow: "Walk-ins welcome", title: "Visit the shop" },
    reviewsFrom: "from {count} customer reviews",
    warrantyCard: "{days}-day warranty",
    warrantyCardText: "On parts and labour, every repair.",
    quickAccess: {
      eyebrow: "Quick access",
      title: "What needs fixing?",
      description: "Browse repairs by device",
      reviews: "Reviews",
    },
    popular: {
      eyebrow: "Popular repairs",
      title: "Transparent, upfront pricing",
      description: "Starting prices — your exact quote is confirmed after a free diagnosis.",
    },
    how: {
      eyebrow: "How it works",
      title: "Fixed in four simple steps",
      steps: [
        {
          title: "Call or text",
          text: "Tell us your device and the problem — we'll give you a time to drop off.",
        },
        { title: "Drop off", text: "Bring your device to our shop. Diagnosis is free." },
        { title: "Diagnose & quote", text: "We confirm the fault and price before any work starts." },
        { title: "Pick up", text: "We'll call or text you as soon as it's ready." },
      ],
    },
    why: {
      title: "Why customers choose us",
      rating: "Average rating",
      repaired: "Devices repaired",
      sameDay: "Fixed same day",
      warranty: "Warranty on repairs",
      warrantyValue: "{days}-day",
    },
    reviews: {
      eyebrow: "Customer reviews",
      title: "What our customers say",
      readAll: "Read all reviews",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Frequently asked questions",
      items: [
        {
          q: "Do I need an appointment?",
          a: "Walk-ins are welcome. Call or text ahead and we'll have a technician ready for you.",
        },
        {
          q: "How much does diagnosis cost?",
          a: "Diagnosis is free for walk-in repairs. You only pay if you approve the quote.",
        },
        {
          q: "Are prices taxed?",
          a: "Prices are listed in Canadian dollars before {tax}. Your quote shows the tax before you approve it.",
        },
        {
          q: "Is my data safe?",
          a: "We never access your personal data beyond what's needed to test the repair. For storage or OS work we'll ask before touching your files.",
        },
        {
          q: "Do repairs come with a warranty?",
          a: "Yes — every repair includes a {days}-day warranty on parts and labour.",
        },
        {
          q: "How will I know when my repair is ready?",
          a: "We'll call or text you as soon as it's done — most repairs are finished the same day.",
        },
      ],
    },
    cta: {
      title: "Call or text to book your repair",
      text: "Walk-ins welcome — free diagnosis on every device.",
    },
  },
  services: {
    metaTitle: "Repair services & prices",
    metaDescription: "Phone, laptop, tablet, PC and console repairs in Toronto with upfront starting prices.",
    title: "Repair services",
    intro: "Upfront starting prices. A free diagnosis confirms your exact quote before we start.",
    searchPlaceholder: "Search services…",
    searchLabel: "Search services",
    categoriesLabel: "Device categories",
    all: "All",
    count: "{count} services",
    countOne: "1 service",
    forQuery: "for “{q}”",
    clearSearch: "clear search",
    noneTitle: "No matching services",
    noneText: "Try another search or browse all repairs.",
    showAll: "Show all services",
    cantFind: "Can't find your repair?",
    cantFindText: "We fix much more than what's listed — tell us what's wrong.",
  },
  service: {
    notFound: "Service not found",
    backTo: "{category} repairs",
    freeDiagnosis: "Free diagnosis",
    freeDiagnosisText: "We confirm the fault before quoting.",
    qualityParts: "Quality parts",
    qualityPartsText: "Tested parts matched to your model.",
    warranty: "{days}-day warranty",
    warrantyText: "On parts and labour.",
    turnaroundText: "Typical turnaround after drop-off.",
    finalPrice: "Final price confirmed after a free diagnosis. No fix, no fee.",
    more: "More {category} repairs",
  },
  review: { repair: "Repair", sample: "Sample review" },
  reviews: {
    metaTitle: "Customer reviews",
    metaDescription: "What customers say about our repairs.",
    title: "Customer reviews",
    intro: "What our customers say about their repairs.",
    count: "{count} reviews",
    countOne: "1 review",
    noneTitle: "No reviews yet",
    noneText: "Reviews from our customers will appear here soon.",
    outOf: "{rating} out of 5 stars",
    statsTitle: "The shop in numbers",
    ratingTitle: "Customer rating",
    freeValue: "Free",
    cta: "Questions before you visit?",
    sampleNote: "These are sample reviews shown as placeholders.",
  },
};

export default en;
export type Dictionary = typeof en;
