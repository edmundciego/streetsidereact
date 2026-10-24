/**
 * Streetside Design System V1 — Token Foundation (React / MUI)
 *
 * Status: ADDITIVE layer. This file introduces the semantic token source of
 * truth; it does not restyle any screen by itself. Theme files
 * (light/dark-theme-options.js) migrate toward these values key-by-key behind
 * the H1–H14 checklist (see STREETSIDE_DESIGN_SYSTEM_V1.md in
 * streetsidesite/frontend/docs/).
 *
 * Rule: no new raw hex in new code — import from here. Existing raw hexes are
 * grandfathered until their screen migrates (H12 freeze: no new palette keys,
 * no deletion of legacy keys this phase).
 *
 * Brand source of truth (exact, never altered):
 *   Dark Teal  #0B4242 · Sea Green #2A9153 · Amber Flame #F6B91C
 *   Baltic Blue #0461A5 · Scarlet #DC2626
 * Never import Stripe visuals (indigo CTAs, pastel mesh, navy, ruby/magenta).
 */

// ---------------------------------------------------------------------------
// 1. Brand (literal hex)
// ---------------------------------------------------------------------------
export const brand = {
  teal: "#0B4242", // Dark Teal — inverse surfaces, featured tiers, structural ink
  green: "#2A9153", // Sea Green — canonical primary CTA / primary data
  amber: "#F6B91C", // Amber Flame — highlight only (ratings, badges, ticks)
  blue: "#0461A5", // Baltic Blue — links + info + Agutify module accent
  scarlet: "#DC2626", // Scarlet — destructive / error
};

// ---------------------------------------------------------------------------
// 2. Brand ramps (V1; brand hue anchored at the 600 stop)
// ---------------------------------------------------------------------------
export const ramps = {
  green: {
    50: "#EAF6EF",
    100: "#D7EDDF",
    200: "#B0DCC0",
    300: "#7FC39C",
    400: "#4FA876",
    500: "#2A9153", // brand.green
    600: "#247B47",
    700: "#1C6641", // == legacy primary.dark (kept intentionally)
    800: "#14532F",
    900: "#0B3B21",
  },
  teal: {
    50: "#EAF1F1",
    100: "#D3E2E2",
    200: "#A9C6C6",
    300: "#7AA6A6",
    400: "#3E7A7A",
    500: "#145252",
    600: "#0B4242", // brand.teal
    700: "#093535",
    800: "#072A2A",
    900: "#021818",
  },
  blue: {
    50: "#EEF5FF",
    100: "#D9E9FA",
    200: "#B0D2F2",
    300: "#7FB5E8",
    400: "#2E7CC4",
    500: "#0461A5", // brand.blue
    600: "#035383",
    700: "#04416A",
    800: "#0A3353",
    900: "#0A2540",
  },
  scarlet: {
    50: "#FEE9E7",
    100: "#FDD3D0",
    200: "#F9A8A2",
    300: "#F87171",
    400: "#E8544A",
    500: "#DC2626", // brand.scarlet
    600: "#B91C1C",
    700: "#922E2E", // == legacy error.dark (kept intentionally)
    800: "#7F1D1D",
    900: "#450A0A",
  },
  amber: {
    50: "#FFFBEB",
    100: "#FFF3C4",
    200: "#F9E091", // == legacy customColor.buyButton (kept intentionally)
    300: "#F6B91C", // brand.amber
    400: "#E8A90B",
    500: "#B45309", // accessible amber-700 text on tint (H1)
    600: "#92400E",
    700: "#78350F",
  },
};

// ---------------------------------------------------------------------------
// 3. Semantic colors — LIGHT (target values; migration status per key)
// ---------------------------------------------------------------------------
export const semanticLight = {
  background: {
    default: "#FFFFFF", // target (resolves #F7F7F7 vs #FCFCFC split — V1-next)
    subtle: "#F6F7FB", // == neutral[300] (kept)
    inverse: brand.teal,
    warm: "#FFFBEB", // == couponBg.discount (kept)
  },
  surface: {
    default: "#FFFFFF",
    raised: "#FFFFFF", // + border.default + elevation.1
    inverse: brand.teal,
  },
  text: {
    primary: "#1F2937", // == neutral[800]; replaces green-gray #3E594D (V1-next)
    secondary: "#4B5563", // == neutral[600]; H1: replaces #93A2AE (≈2.9:1 fail)
    muted: "#6B7280", // == neutral[500]; H1: new additive key
    inverse: "#FFFFFF",
    link: brand.blue, // H-migration: replaces #2A61BA / #3979E0
  },
  border: {
    default: "#E6E8F0", // == divider (kept)
    strong: "#9CA3AF",
    subtle: "#E5E7EB",
    focus: brand.green, // H3 focus ring
  },
  status: {
    success: brand.green, // bg-tint #E4FFF3 (== primary.semiLight, kept)
    warning: "#B45309", // H1: amber-700 text on #FFFBEB (replaces white-on-#FFB020)
    info: brand.blue, // H-migration: replaces #2196F3 family
    error: brand.scarlet, // H-migration: replaces #D14343 / #ec221f
  },
  interaction: {
    hover: ramps.green[600], // darken(primary, ~8%)
    pressed: ramps.green[700], // darken(primary, ~15%) == legacy primary.dark
    focus: brand.green, // 2px ring + 2px offset (H3)
    disabledBackground: "rgba(55, 65, 81, 0.12)", // == action.disabledBackground (kept)
    disabledText: "rgba(55, 65, 81, 0.26)", // == action.disabled (kept)
  },
};

// ---------------------------------------------------------------------------
// 4. Semantic colors — DARK (mirrors; lightened stops, never new hues)
// ---------------------------------------------------------------------------
export const semanticDark = {
  text: {
    primary: "#E8EAEC", // kept
    secondary: "#A0AEC0", // kept (≈7:1 on #1E1E1E — passes)
    muted: "#9CA3AF",
    inverse: "#FFFFFF",
    link: ramps.blue[300], // V1: lightened Baltic for dark bg (replaces #2A61BA ≈2.5:1 fail)
  },
  status: {
    success: brand.green,
    warning: "#B45309",
    info: ramps.blue[300],
    error: brand.scarlet,
  },
  interaction: {
    focus: ramps.green[400], // lightened Sea Green ring for dark bg
  },
};

// ---------------------------------------------------------------------------
// 5. Typography roles (DM Sans + Rubik stay — principles, not files)
// ---------------------------------------------------------------------------
export const typographyRoles = {
  fontFamily: '"DM Sans","Rubik","sans-serif"',
  display: { weight: 700, tracking: "-0.01em", lineHeight: 1.15 }, // h1–h3 intent (V1-next)
  body: { default: "body1 14px/1.5", lineHeight: 1.5 }, // H2: body2/body3 11.85px → 1.5
  tabular: '"tnum" on every money/numeric cell via .tnum utility (H11)',
  button: { weight: 600 },
  caption: { size: "12px", lineHeight: 1.66 },
};

// ---------------------------------------------------------------------------
// 6. Spacing ladder (8px base; MUI default retained, codified here)
// ---------------------------------------------------------------------------
export const space = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  huge: 64,
};
export const sectionSpacing = {
  marketingOuter: "64–96px",
  productOuter: "32–48px",
  cardPadding: "32px 24px", // == MuiCardContent/Header (kept)
};

// ---------------------------------------------------------------------------
// 7. Radius scale (every current value lands here except strays)
// ---------------------------------------------------------------------------
export const radius = {
  xs: 4, // tags, table chrome
  sm: 6, // form inputs (React 5/13 converge here V1-next)
  md: 8, // buttons, compact cards, alerts (== shape.borderRadius)
  lg: 12, // feature/pricing cards, file preview
  xl: 16, // large cards (CustomPaper 2rem converges V1-next)
  dialog: 20, // dialogs + sheets (== MuiDialog paper)
  pill: 9999, // chips + tags + status pills ONLY, never CTAs
};

// ---------------------------------------------------------------------------
// 8. Elevation (borders carry structure; shadows whisper)
// ---------------------------------------------------------------------------
export const elevation = {
  0: "none",
  1: "0 1px 2px rgba(16, 24, 40, 0.06)",
  2: "0 8px 24px rgba(16, 24, 40, 0.08), 0 2px 6px rgba(16, 24, 40, 0.04)",
  wash: "Dark Teal overlay scrim", // atmospheric depth (Streetside analogue of Stripe mesh)
};

// ---------------------------------------------------------------------------
// 9. Motion (restrained; layout never shifts on entrance)
// ---------------------------------------------------------------------------
export const motion = {
  fast: "150ms ease-out", // color / border / opacity micro-feedback
  base: "200–300ms ease-out", // sheets / dialogs / dropdowns / shimmer
  reducedMotion: "honor prefers-reduced-motion (no lift, no scale, no entrance)",
};

// ---------------------------------------------------------------------------
// 10. CTA hierarchy (one filled primary per view)
// ---------------------------------------------------------------------------
export const ctaHierarchy = {
  primary: "filled Sea Green (brand.green)", // canonical Streetside primary CTA
  secondary: "outline teal/green",
  tertiary: "Baltic Blue link",
  destructive: "Scarlet + explicit confirm",
  rule: "Amber never competes as a primary CTA; Baltic Blue = info/module accent; Dark Teal = structural/inverse.",
};

// ---------------------------------------------------------------------------
// 11. Module-accent rule (INVENT — H9 resolution)
// ---------------------------------------------------------------------------
export const moduleAccent = {
  rule: "A module owns ONE accent for illustration/highlight only — never for primary CTA or body text.",
  stores: brand.green, // Sea Green module identity (commerce)
  agutify: brand.blue, // Baltic Blue module identity (services) — informational use only
  note: "Primary CTA stays Sea Green everywhere so 'what do I press' never changes. Dark-only outliers (#31C0F5/#EF7822) stay frozen until their module migrates to this rule.",
};

// ---------------------------------------------------------------------------
// 12. Status-chip contract (INVENT — replaces customColor.status* sprawl V1-next)
// ---------------------------------------------------------------------------
export const statusChip = {
  success: { bg: "#E4FFF3", text: "#2A9153" },
  warning: { bg: "#FFFBEB", text: "#B45309" },
  info: { bg: "#EEF5FF", text: "#0461A5" },
  error: { bg: "#FEE9E7", text: "#DC2626" },
};

// ---------------------------------------------------------------------------
// 13. Trust Contract (INVENT — gating checklist for every meaningful action)
// ---------------------------------------------------------------------------
export const trustContract = {
  before: "What am I about to do? (items, total, address/schedule, fee, who)",
  during: "What is happening? (stepper, map, OTP, polling, haptics, live region)",
  after: "What happened? (receipt/id/amount/time — never a bare toast)",
  next: "What can I do now? (track · contact · rebook · repay · review · cancel-with-reason · get-help)",
};

// ---------------------------------------------------------------------------
// 14. H12 deprecation map — frozen keys (no new keys; no deletion this phase)
// ---------------------------------------------------------------------------
export const deprecatedKeysFrozen = {
  background: ["custom", "custom2", "custom3", "custom4", "custom5", "custom6", "custom7"],
  primary: ["customType1", "customType2", "customType3", "overLay"],
  warning: ["lite", "liter", "lighter", "secondary", "new"],
  error: ["deepLight", "danger", "dangerLight", "dangerText", "red"],
  info: ["lite", "tertiary", "contrastText1", "blue", "custom1"],
  note: "Collapse into semanticLight/semanticDark in V1-next, screen-by-screen with screenshots. Never reference from new code.",
};
