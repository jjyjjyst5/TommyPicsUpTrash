/**
 * Editorial content sourced from public reporting on Tom Ross's cleanup work
 * (CBS Pittsburgh, Pittsburgh Magazine, TribLive, WPXI, stevensoncreek.org)
 * and his public X/Instagram feed. Numbers live in the database; this file
 * holds the prose, quotes, links and timeline that rarely change.
 */

export const SOCIAL = {
  handle: "TommyPicsUpTrash",
  twitter: "https://x.com/TJRPitt",
  instagram: "https://www.instagram.com/tommypicsuptrash/",
};

export const HERO = {
  eyebrow: "One person. One kayak. Cleaner water.",
  title: "Tommy Pics 📸 Up Trash",
  subtitle:
    "Tom Ross has spent years paddling out — alone — to pull litter from Pittsburgh's Ohio River and Clearwater's Stevenson Creek. One bag at a time, he's proving what a single determined person can do for our waterways.",
};

// Section eyebrows / headings / intros. These are the editable "text blocks"
// surfaced in Admin → Site Text; saved overrides live in the site_content table
// and these are the fallbacks (see lib/siteText.ts). Keep them in sync with what
// the components render by default.
export const IMPACT = {
  eyebrow: "The running count",
  heading: "The count, broken down by waterway.",
  intro:
    "Totals update as Tommy logs each cleanup. Pounds are estimated at ~20 lbs per bag — grounded in his own field numbers — unless a weighed amount is recorded.",
};

export const FINDS = {
  eyebrow: "Wildest finds",
  heading: "You won't believe what comes out of the water",
  intro:
    "Beyond the bottles: the strangest, most jaw-dropping things Tommy has pulled from the river and creek — and the trash scenes that say it all.",
};

export const GALLERY = {
  eyebrow: "From the water",
  heading: "The view from the kayak",
  intro:
    "Real photos from Tommy's cleanups — the hauls, the river, and the wildlife that depends on it.",
};

export const PRESS_SECTION = {
  eyebrow: "In the news",
  heading: "The story keeps spreading",
  intro:
    "From local radio to regional features — coverage that turns one kayak into a movement.",
};

export const INVOLVED = {
  eyebrow: "Get involved",
  heading: "One person made a dent. Imagine all of us.",
  intro:
    "You don't need a kayak to help. Small, repeated choices keep more litter out of the water than any single cleanup ever could.",
  ctaTitle: "Follow the count. Spread the word.",
  ctaBody: "Every share puts more eyes on the water. Follow @TommyPicsUpTrash.",
};

export const QUOTES: { text: string; context?: string }[] = [
  {
    text: "I fill up my kayak as much as I can, and sadly, it's not even very difficult.",
    context: "on how much litter is out there",
  },
  {
    text: "I think if they really knew what it looked like up close, they would be shocked and embarrassed.",
    context: "on what he sees from the water",
  },
  {
    text: "We cannot clean our way out of this.",
    context: "on prevention over cleanup",
  },
  {
    text: "You don't have to go crazy with this. Just make a little bit of difference.",
    context: "his message to everyone else",
  },
];

export const STORY = {
  heading: "Why one man keeps paddling out",
  paragraphs: [
    "Tom Ross is a retired banker and a 1992 graduate of Shaler High School who splits his time between Pittsburgh and Clearwater, Florida. The mission started simply: he and his wife noticed litter while down in Florida, then wondered what the water looked like back home. It was worse than he expected.",
    "So he got a kayak. Since the summer of 2022 he's paddled a roughly 2.5-mile stretch of the Ohio River near Pittsburgh's Chateau neighborhood about three times a week, and he's worked Stevenson Creek in Clearwater by kayak since May of that same year — filling bag after bag with single-use plastic bottles, tires, barrels, foam, and the occasional traffic cone.",
    "He documents every haul on X and Instagram as @TommyPicsUpTrash, partnering with local groups to install trash barriers and report hotspots. Along the way he's also documented the wildlife that depends on this water — manatees, dolphins, otters, herons, even a Goliath grouper. The point isn't that one person can finish the job. It's that one person can refuse to look away.",
  ],
};

export const TIMELINE: { date: string; title: string; body: string }[] = [
  {
    date: "May 2022",
    title: "The first kayak trips",
    body: "Begins cleaning Stevenson Creek in Clearwater, Florida, by kayak.",
  },
  {
    date: "Summer 2022",
    title: "Hometown waters",
    body: "Starts working a 2.5-mile stretch of Pittsburgh's Ohio River about three times a week.",
  },
  {
    date: "2022",
    title: "500-bag goal — met early",
    body: "Sets a goal of 500 bags for the year and reaches it before the winter break.",
  },
  {
    date: "Feb 2025",
    title: "Barriers go in",
    body: "Partners install a trash 'Goat' and barriers on Stevenson Creek; 450th creek bag logged.",
  },
  {
    date: "Sep 2025",
    title: "700th Ohio River bag",
    body: "Hauls his 700th bag of litter from the Ohio River — plus two boat bumpers and a milk crate.",
  },
  {
    date: "Today",
    title: "Still out there",
    body: "On the radio, in the news, and back on the water — raising awareness one haul at a time.",
  },
];

export const HOW_TO_HELP = [
  {
    title: "Pack it out",
    body: "Whatever you bring to the river, take home — including the things that blow out of trucks and trash cans on the way.",
  },
  {
    title: "Skip single-use plastic",
    body: "Plastic bottles are the #1 thing Tommy pulls from the water. A reusable bottle keeps thousands out of the current.",
  },
  {
    title: "Report a hotspot",
    body: "In Pittsburgh, the city's 311 'My Burgh' app gets illegal dumping and litter piles on the radar.",
  },
  {
    title: "Adopt a stretch",
    body: "Pick a creek, a bank, a storm drain near you. You don't need a kayak to make a dent — just a bag and an afternoon.",
  },
];

export const PARTNERS = [
  {
    name: "Allegheny CleanWays",
    region: "Pittsburgh, PA",
    url: "https://alleghenycleanways.org/",
  },
  {
    name: "Friends of the Riverfront",
    region: "Pittsburgh, PA",
    url: "https://friendsoftheriverfront.org/",
  },
  {
    name: "Keep Pinellas Beautiful",
    region: "Clearwater, FL",
    url: "https://www.kpbfl.org/",
  },
  {
    name: "Stevenson Creek Advocacy Group",
    region: "Clearwater, FL",
    url: "https://stevensoncreek.org/",
  },
];
