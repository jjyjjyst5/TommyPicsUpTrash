/**
 * Parse a pasted tweet/caption from @TommyPicsUpTrash into structured haul
 * data. Pure and deterministic so the admin "paste-a-tweet" flow can show an
 * editable preview before anything is written to the database.
 *
 * It does NOT touch the DB — reconciling a cumulative "Nth bag" total against
 * the current stored total is left to the caller, which knows the running sum.
 */

export type BodySlug = "ohio-river" | "stevenson-creek";

export type ParsedTweet = {
  /** Best-guess water body, or null if undetermined. */
  bodySlug: BodySlug | null;
  bodyConfidence: "high" | "low";
  /** Explicit increment, e.g. "removed 8 bags". */
  bags: number | null;
  /** Cumulative milestone, e.g. "my 700th bag". */
  cumulativeBags: number | null;
  /** Bottle count if mentioned. */
  bottles: number | null;
  /** Human-readable notes about what matched, for the preview UI. */
  matched: string[];
};

const toInt = (s: string) => parseInt(s.replace(/[,\s]/g, ""), 10);

function detectBody(text: string): { slug: BodySlug | null; confidence: "high" | "low" } {
  const t = text.toLowerCase();
  const ohio = /\b(ohio river|pittsburgh|pgh|'?burgh|allegheny|chateau)\b/.test(t);
  const creek =
    /\b(stevenson creek|stevenson|clearwater|pinellas|florida|the creek)\b/.test(t);
  if (ohio && !creek) return { slug: "ohio-river", confidence: "high" };
  if (creek && !ohio) return { slug: "stevenson-creek", confidence: "high" };
  if (ohio && creek) return { slug: "ohio-river", confidence: "low" };
  // Bare "creek" / "river" as a weak fallback.
  if (/\bcreek\b/.test(t)) return { slug: "stevenson-creek", confidence: "low" };
  if (/\briver\b/.test(t)) return { slug: "ohio-river", confidence: "low" };
  return { slug: null, confidence: "low" };
}

export function parseTweet(raw: string): ParsedTweet {
  const text = raw ?? "";
  const matched: string[] = [];

  const { slug, confidence } = detectBody(text);
  if (slug) {
    matched.push(
      `Water body: ${slug === "ohio-river" ? "Ohio River" : "Stevenson Creek"} (${confidence} confidence)`
    );
  } else {
    matched.push("Water body: could not determine — please pick one");
  }

  // Cumulative milestone: "700th bag", "my 450th bag/litter bag"
  let cumulativeBags: number | null = null;
  const ordinal = text.match(/\b([\d,]{1,7})\s*(?:st|nd|rd|th)\s+(?:bag|litter|trash)/i);
  if (ordinal) {
    cumulativeBags = toInt(ordinal[1]);
    matched.push(`Cumulative milestone: ${cumulativeBags}th bag`);
  }

  // Explicit increment: "removed 8 bags", "8 bags", "filled 12 trash bags"
  let bags: number | null = null;
  if (!cumulativeBags) {
    const inc = text.match(
      /\b([\d,]{1,5})\s+(?:large\s+|big\s+|trash\s+|garbage\s+|litter\s+)*bags?\b/i
    );
    if (inc) {
      bags = toInt(inc[1]);
      matched.push(`Bags this haul: ${bags}`);
    }
  }

  // Bottles: "130 bottles", "+ 130 bottles", "12,000 plastic bottles"
  let bottles: number | null = null;
  const bot = text.match(/\+?\s*([\d,]{1,7})\s+(?:plastic\s+)?bottles?\b/i);
  if (bot) {
    bottles = toInt(bot[1]);
    matched.push(`Bottles: ${bottles}`);
  }

  return { bodySlug: slug, bodyConfidence: confidence, bags, cumulativeBags, bottles, matched };
}
