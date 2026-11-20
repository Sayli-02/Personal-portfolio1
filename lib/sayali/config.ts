/**
 * Sayali portfolio assets.
 *
 * Place files in /public:
 *   sayli-hero.png   — required flattened hero (character + scene)
 *   sayli-case.jpg   — optional laptop/case still (falls back to hero)
 *   sayli-trans.mp4  — optional dive clip (never use the old Haldoren male clip)
 */

export const assets = {
  plate: "/sayli-hero.png",
  /** Laptop-forward still for case mode; use hero until a dedicated case still exists. */
  casePlate: "/sayli-hero.png",
  /** Lanyard chrome only (empty sleeve) — not a character photo. */
  badge:
    "https://images.higgs.ai/?default=1&output=webp&url=" +
    encodeURIComponent(
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261111_001143_65c037e6-0768-4b12-9f17-17be132ce16b.png",
    ) +
    "&w=1200&q=85",
  /** Optional Sayali dive clip — engine uses cinematic still fallback until this loads. */
  trans: "/sayli-trans.mp4",
} as const;

/** Flattened hero: no transparent cutout layer. */
export const HAS_CUTOUT = false;

export type CaseData = {
  video: string;
  title: string;
  rows: [string, string, string];
  key: string;
  text: string;
};

const R2 = "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/aaaf/";

export const cases: CaseData[] = [
  {
    video: R2 + "vell-lookbook.mp4",
    title: "VELL LOOKBOOK",
    rows: ["STUDIO VELL", "E-COMMERCE", "2026"],
    key: "// vell lookbook",
    text: "— a runway lookbook where every look steps forward on scroll and the cart follows along.",
  },
  {
    video: R2 + "vasari-vhs-hero.mp4",
    title: "VASARI SHELF",
    rows: ["VASARI ARCHIVE", "PORTFOLIO", "2026"],
    key: "// vasari shelf",
    text: "— a director’s archive told as a shelf of tapes: pull one out and its story plays.",
  },
  {
    video: R2 + "living-portrait-hero.mp4",
    title: "MINA PORTRAIT",
    rows: ["MINA 3D", "PERSONAL SITE", "2025"],
    key: "// mina portrait",
    text: "— a 3D creator’s homepage where the portrait follows your cursor and pulls faces.",
  },
];

export const brand = {
  name: "SAYLI",
  title: "Sayli — AI/ML Engineer Portfolio",
  script: "AI/ML ENGINEER • DEVELOPER",
  logo: "SAYLI",
  card: {
    heading: ["DEVELOPER", "CARD"] as const,
    year: "2026",
    role: "AI/ML ENGINEER // DEVELOPER",
    rows: [
      ["NAME", "SAYLI"],
      ["FOCUS", "AI / ML"],
      ["GITHUB", "Sayli-02"],
      ["EMAIL", "KSAYLI235@GMAIL.COM"],
    ] as const,
  },
} as const;
