/**
 * Registry of every editable text block on the public homepage. Admin → Site
 * Text renders one field per entry; saved values live in the `site_content` KV
 * table keyed by `key`, and an empty/blank value falls back to the default
 * (the prose in lib/content.ts). This is the single source of truth for which
 * strings are editable and how they map onto the section components.
 */
import { HERO, IMPACT, FINDS, GALLERY, PRESS_SECTION, INVOLVED } from "./content";

export type SiteTextField = {
  key: string;
  label: string;
  hint?: string;
  type: "text" | "textarea";
  default: string;
};

export type SiteTextGroup = { id: string; label: string; fields: SiteTextField[] };

export const SITE_TEXT_GROUPS: SiteTextGroup[] = [
  {
    id: "hero",
    label: "Hero — the very top of the page",
    fields: [
      { key: "hero_eyebrow", label: "Eyebrow (small line above the title)", type: "text", default: HERO.eyebrow },
      { key: "hero_title", label: "Title (the big headline — emoji are fine)", type: "text", default: HERO.title },
      { key: "hero_subtitle", label: "Subtitle", type: "textarea", default: HERO.subtitle },
    ],
  },
  {
    id: "impact",
    label: "Impact — the count, by waterway",
    fields: [
      { key: "impact_eyebrow", label: "Eyebrow", type: "text", default: IMPACT.eyebrow },
      { key: "impact_heading", label: "Heading", type: "text", default: IMPACT.heading },
      { key: "impact_intro", label: "Intro paragraph", type: "textarea", default: IMPACT.intro },
    ],
  },
  {
    id: "finds",
    label: "Wildest Finds",
    fields: [
      { key: "finds_eyebrow", label: "Eyebrow", type: "text", default: FINDS.eyebrow },
      { key: "finds_heading", label: "Heading", type: "text", default: FINDS.heading },
      { key: "finds_intro", label: "Intro paragraph", type: "textarea", default: FINDS.intro },
    ],
  },
  {
    id: "gallery",
    label: "Gallery — the view from the kayak",
    fields: [
      { key: "gallery_eyebrow", label: "Eyebrow", type: "text", default: GALLERY.eyebrow },
      { key: "gallery_heading", label: "Heading", type: "text", default: GALLERY.heading },
      { key: "gallery_intro", label: "Intro paragraph", type: "textarea", default: GALLERY.intro },
    ],
  },
  {
    id: "press",
    label: "In the News",
    fields: [
      { key: "press_eyebrow", label: "Eyebrow", type: "text", default: PRESS_SECTION.eyebrow },
      { key: "press_heading", label: "Heading", type: "text", default: PRESS_SECTION.heading },
      { key: "press_intro", label: "Intro paragraph", type: "textarea", default: PRESS_SECTION.intro },
    ],
  },
  {
    id: "involved",
    label: "Get Involved",
    fields: [
      { key: "involved_eyebrow", label: "Eyebrow", type: "text", default: INVOLVED.eyebrow },
      { key: "involved_heading", label: "Heading", type: "text", default: INVOLVED.heading },
      { key: "involved_intro", label: "Intro paragraph", type: "textarea", default: INVOLVED.intro },
      { key: "involved_cta_title", label: "Follow box — heading", type: "text", default: INVOLVED.ctaTitle },
      { key: "involved_cta_body", label: "Follow box — text", type: "textarea", default: INVOLVED.ctaBody },
    ],
  },
];

export const SITE_TEXT_FIELDS: SiteTextField[] = SITE_TEXT_GROUPS.flatMap((g) => g.fields);

export const SITE_TEXT_KEYS: string[] = SITE_TEXT_FIELDS.map((f) => f.key);

const DEFAULTS: Record<string, string> = Object.fromEntries(
  SITE_TEXT_FIELDS.map((f) => [f.key, f.default])
);

export type SiteText = {
  hero: { eyebrow: string; title: string; subtitle: string };
  impact: { eyebrow: string; heading: string; intro: string };
  finds: { eyebrow: string; heading: string; intro: string };
  gallery: { eyebrow: string; heading: string; intro: string };
  press: { eyebrow: string; heading: string; intro: string };
  involved: {
    eyebrow: string;
    heading: string;
    intro: string;
    ctaTitle: string;
    ctaBody: string;
  };
};

/** Flat key → effective value map (override if set, else default). For the admin editor. */
export function resolveSiteTextFlat(overrides: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    SITE_TEXT_FIELDS.map((f) => [f.key, overrides[f.key]?.trim() || f.default])
  );
}

/** Merge saved overrides (key → value) onto the defaults into a typed, nested shape. */
export function resolveSiteText(overrides: Record<string, string>): SiteText {
  const v = (key: string) => overrides[key]?.trim() || DEFAULTS[key];
  return {
    hero: { eyebrow: v("hero_eyebrow"), title: v("hero_title"), subtitle: v("hero_subtitle") },
    impact: { eyebrow: v("impact_eyebrow"), heading: v("impact_heading"), intro: v("impact_intro") },
    finds: { eyebrow: v("finds_eyebrow"), heading: v("finds_heading"), intro: v("finds_intro") },
    gallery: { eyebrow: v("gallery_eyebrow"), heading: v("gallery_heading"), intro: v("gallery_intro") },
    press: { eyebrow: v("press_eyebrow"), heading: v("press_heading"), intro: v("press_intro") },
    involved: {
      eyebrow: v("involved_eyebrow"),
      heading: v("involved_heading"),
      intro: v("involved_intro"),
      ctaTitle: v("involved_cta_title"),
      ctaBody: v("involved_cta_body"),
    },
  };
}
