// Colors
// V1 H12 FREEZE: no new palette keys may be added here. Legacy near-duplicate
// keys (background.custom–custom7, primary.customType1-3, warning.lite/liter/
// lighter, error.danger/dangerLight/dangerText/red, info.lite/tertiary/blue/
// custom1) are grandfathered — collapse into theme/tokens.js semantics
// screen-by-screen in V1-next. Never reference frozen keys from new code.

const neutral = {
  90: "#FFFFFF1A",
  100: "#FFFFFF",
  200: "#E5E7EB",
  300: "#F6F7FB",
  400: "#9CA3AF",
  450: "#A3A3A3", // Figma: --sds-color-text-default-tertiary (placeholder)
  500: "#6B7280",
  600: "#4B5563",
  700: "#374151",
  800: "#1F2937",
  900: "#111827",
  1000: "#212E28",
  1050: "#1e1e1e", // Figma: --sds-color-text-default-default
  1100: "#D6D6D6",
};

const background = {
  default: "#F7F7F7", // "#F9FAFC",
  paper: "#FFFFFF",
  secondary: "#F2F2F2", // Figma: --sds-color-background-default-secondary
  custom: "#f1f2f5",
  custom2: "#FFFFFF",
  custom3: "#F6F7FB",
  custom4: "#ffffff",
  footer1: "#9f9f9f1a",
  footer2: "#9f9f9f0d",
  custom5: "#F4F6F8",
  custom6: "#FCFCFD",
  custom7: "#F6F6F6",
};

const divider = "#E6E8F0";

const primary = {
  main: "#2A9153", // V1: Streetside Sea Green (was near-miss #039D55) — see tokens.js brand.green
  deep: "#026034",
  light: "#EBFDF2",
  dark: "#1c6641", // == ramps.green[700] (kept intentionally as interaction.pressed)
  semiLight: "#E4FFF3",
  contrastText: "#FFFFFF", // white on Sea Green 600 ≈ 4.9:1 — passes
  customType1: "#0DCB72",
  customType2: "#3BB77E",
  customType3: "#29CE00",
  overLay: "#000000",
  lite: "rgba(42, 145, 83, 0.1)", // V1: re-anchored to Sea Green (was 3,157,85)
  icon: "#2A9153", // V1: re-anchored to Sea Green
};
const moduleTheme = {
  // V1 H9: values frozen pending the module-accent rule (tokens.js moduleAccent).
  // Light stays all-Sea-Green (= primary); dark file documents its mixed outliers.
  pharmacy: "#2A9153",
  ecommerce: "#2A9153",
  food: "#2A9153",
  parcel: "#2A9153",
};
const horizontalCardBG = "#E4FFF3";

const secondary = {
  main: "#10B981",
  light: "#3FC79A",
  dark: "#0B815A",
  contrastText: "#111827", // V1 H1: was white (≈1.8:1 fail) — dark text on bright green
};

const success = {
  main: "#14B8A6",
  light: "#43C6B7",
  dark: "#0E8074",
  contrastText: "#111827", // V1 H1: was white (≈2.2:1 fail) — dark text on bright teal
};

const info = {
  main: "#0461A5", // V1: Streetside Baltic Blue (was #2196F3) — see tokens.js brand.blue
  light: "#64B6F7",
  dark: "#0B79D0",
  lite: "#DBF5FF",
  tertiary: "#f1f6fd",
  contrastText: "#FFFFFF", // white on Baltic 500 ≈ 7:1 — passes
  contrastText1: "#F5F6F8",
  blue: "#0D6EFD",
  custom1: "#31C0F5",
};

const warning = {
  main: "#FFB020",
  light: "#FFF8D5",
  lite: "#FFBD8B",
  liter: "#FFF8F2",
  lighter: "#fffbeb",
  dark: "#FE961C",
  secondary: "#bf6a02",
  contrastText: "#111827", // V1 H1: was white (≈1.6:1 fail) — dark text on amber
  new: "#FFC817",
};

const error = {
  main: "#DC2626", // V1: Streetside Scarlet (was #D14343) — see tokens.js brand.scarlet
  light: "#DA6868",
  dark: "#922E2E", // == ramps.scarlet[700] (kept intentionally)
  contrastText: "#FFFFFF", // white on Scarlet 500 ≈ 4.8:1 — passes
  deepLight: "#FF725E",
  // Figma danger tokens
  danger: "#DC2626", // V1: re-anchored to Scarlet (was #ec221f ≈4.0:1 → ≈4.8:1)
  dangerLight: "#fdd3d0", // background-danger-secondary (free delivery badge)
  dangerText: "#c00f0c", // text-danger-secondary
  red: "#f44336", // standard red (heart, trash icons)
};

const text = {
  primary: "#3E594D",
  secondary: "#4B5563", // V1 H1: was #93A2AE (≈2.9:1 fail) — neutral-600
  muted: "#6B7280", // V1 H1: new additive key (neutral-500) for helpers/placeholders
  disabled: "rgba(55, 65, 81, 0.48)",
  custom: "#3F3F3F",
  customText1: "#4B5563",
  info: "#0461A5", // V1: Baltic Blue (was #3979E0)
  link: "#0461A5", // V1: Baltic Blue (was #2A61BA)
};

const footer = {
  inputButton: "#BBFFDF",
  inputButtonHover: "#6dcfa6",
  bottom: "rgba(0, 98, 52, 0.3)",
  foodBottom: "#686B78",
  appDownloadButtonBg: "#1A1A1A",
  appDownloadButtonBgGray: "#3E594D",
  appDownloadButtonBgHover: "#4f4f4f",
  foodFooterBg: "#414141",
};
const customColor = {
  textGray: "#9c9c9c",
  textGrayDeep: "#787676",
  buyButton: "#F9E091",
  parcelWallet: "#8B3FFD",
  rebookIcon: "#6464EE",
  starAmber: "#F59E0B", // star/rating color
  vegGreen: "#4caf50", // veg indicator green
  vegIcon: "#71B63A", // veg SVG icon fill
  textNeutral: "#303030", // Figma text-neutral-default (item name)
  newBadge: "#e8b931", // "New" store badge bg (Figma warning)
  ratingCount: "#949494", // rating review count color (Figma text-neutral-tertiary)
  deliveryText: "#5a5a5a", // delivery info text (Figma text-neutral-secondary)
  tagBg: "#e0e0e0", // "+N" overflow badge, dividers (Figma background-default-tertiary)
  statusPendingBg: "#DBE9FF",
  statusPendingText: "#224A8A",
  statusReviewBg: "#CFF7D3",
  statusReviewText: "#009951",
  statusCancelledBg: "#FDF0DC",
  statusCancelledText: "#B5680A",
  proBannerBlueBg: "#3979E0",
};
const whiteContainer = {
  main: "#ffffff",
};
const pink = {
  main: "#FF6D76",
};
const foodCardColor = "#FFF6EF";
const paperBoxShadow = "#E5EAF1";
const couponBg = {
	pro: "#F1F6FD",
	discount: "#FFFBEB",
	ticket: "#FEE9E7",
};
const happyHourBanner = {
	bg: "#FEE9E7",
	timerBg: "#EC221F",
	timerColon: "#900B09",
	timerColonWarm: "#BF6A02",
};
const progressOffer = {
	bg: "#FFF1C2",
	track: "#FFFBEB",
	fill: "#BF6A02",
	chip: "#EC221F",
};
const bogoBanner = {
	bg: "#DBE9FF",
};
const roundStackOne = "rgba(255, 255, 255, 0.04)";
const roundStackTwo = "rgba(255, 255, 255, 0.06)";
const toolTipColor = neutral[1000];

export const lightThemeOptions = {
  components: {
    MuiUseMediaQuery: { defaultProps: { noSsr: true } }, // ⚡ Fix hydration
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: neutral[500],
          color: "#FFFFFF",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          "&.MuiChip-filledDefault": {
            backgroundColor: neutral[200],
            "& .MuiChip-deleteIcon": {
              color: neutral[400],
            },
          },
          "&.MuiChip-outlinedDefault": {
            "& .MuiChip-deleteIcon": {
              color: neutral[300],
            },
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          "&::placeholder": {
            opacity: 1,
            color: text.secondary,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: divider,
        },
        input: {
          "&:-webkit-autofill": {
            "-webkit-box-shadow": "0 0 0 100px #f0f5f5 inset",
            "-webkit-text-fill-color": "#000",
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderColor: divider,
          borderStyle: "solid",
          borderWidth: 1,
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderColor: divider,
          borderStyle: "solid",
          borderWidth: 1,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          color: neutral[500],
        },
        track: {
          backgroundColor: neutral[400],
          opacity: 1,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${divider}`,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: neutral[100],
          ".MuiTableCell-root": {
            color: neutral[700],
          },
        },
      },
    },
  },
  palette: {
    action: {
      active: neutral[500],
      focus: "rgba(55, 65, 81, 0.12)",
      hover: "rgba(55, 65, 81, 0.04)",
      selected: "rgba(55, 65, 81, 0.08)",
      disabledBackground: "rgba(55, 65, 81, 0.12)",
      disabled: "rgba(55, 65, 81, 0.26)",
    },
    horizontalCardBG,
    background,
    divider,
    error,
    info,
    mode: "light",
    neutral,
    primary,
    secondary,
    success,
    text,
    warning,
    footer,
    customColor,
    whiteContainer,
    pink,
    paperBoxShadow,
    foodCardColor,
    moduleTheme,
    roundStackOne,
    roundStackTwo,
    toolTipColor,
    couponBg,
    happyHourBanner,
    progressOffer,
    bogoBanner,
  },
  shadows: [
    "none",
    "0px 1px 1px rgba(100, 116, 139, 0.06), 0px 1px 2px rgba(100, 116, 139, 0.1)",
    "0px 1px 2px rgba(100, 116, 139, 0.12)",
    "0px 1px 4px rgba(100, 116, 139, 0.12)",
    "0px 1px 5px rgba(100, 116, 139, 0.12)",
    "0px 1px 6px rgba(100, 116, 139, 0.12)",
    "0px 2px 6px rgba(100, 116, 139, 0.12)",
    "0px 3px 6px rgba(100, 116, 139, 0.12)",
    "0px 2px 4px rgba(31, 41, 55, 0.06), 0px 4px 6px rgba(100, 116, 139, 0.12)",
    "0px 5px 12px rgba(100, 116, 139, 0.12)",
    "0px 5px 14px rgba(100, 116, 139, 0.12)",
    "0px 5px 15px rgba(100, 116, 139, 0.12)",
    "0px 6px 15px rgba(100, 116, 139, 0.12)",
    "0px 7px 15px rgba(100, 116, 139, 0.12)",
    "0px 8px 15px rgba(100, 116, 139, 0.12)",
    "0px 9px 15px rgba(100, 116, 139, 0.12)",
    "0px 10px 15px rgba(100, 116, 139, 0.12)",
    "0px 12px 22px -8px rgba(100, 116, 139, 0.25)",
    "0px 13px 22px -8px rgba(100, 116, 139, 0.25)",
    "0px 14px 24px -8px rgba(100, 116, 139, 0.25)",
    "0px 10px 10px rgba(31, 41, 55, 0.04), 0px 20px 25px rgba(31, 41, 55, 0.1)",
    "0px 25px 50px rgba(100, 116, 139, 0.25)",
    "0px 25px 50px rgba(100, 116, 139, 0.25)",
    "0px 25px 50px rgba(100, 116, 139, 0.25)",
    "0px 25px 50px rgba(100, 116, 139, 0.25)",
  ],
};
