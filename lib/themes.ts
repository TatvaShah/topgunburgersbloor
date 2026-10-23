import type { FontKey, ThemeColors, ThemePresetName } from "./types";

type Preset = {
  colors: ThemeColors;
  fonts: { display: FontKey; body: FontKey; script: FontKey };
  radius: "soft" | "round" | "sharp";
  wordmark?: "display" | "script"; // script fonts are only ever used for the wordmark
  headingCase?: "normal" | "upper";
};

// Font rule: headings use clean faces only (DM Serif Display, Playfair Display, Cormorant, Anton,
// Montserrat, Outfit, Inter). No swashy display serifs like Fraunces. Script fonts: wordmark only.

export const presets: Record<ThemePresetName, Preset> = {
  // Cakes, cupcakes, cookies, dessert tables
  "bakery-pastel": {
    colors: {
      bg: "#fbf6f1",
      surface: "#ffffff",
      ink: "#3a2420",
      text: "#4a3430",
      muted: "#7a625b",
      accent: "#c0566e",
      accentInk: "#ffffff",
      soft: "#f6e1e3",
      line: "#ecdcd4",
    },
    fonts: { display: "playfair", body: "outfit", script: "greatVibes" },
    radius: "round",
  },
  // Home kitchens, caterers, tiffin, street food
  "warm-food": {
    colors: {
      bg: "#fbf5ea",
      surface: "#fffdf8",
      ink: "#2b1d12",
      text: "#3d2c1f",
      muted: "#6e5a48",
      accent: "#c2501f",
      accentInk: "#ffffff",
      soft: "#f4e2c4",
      line: "#e8d8bd",
    },
    fonts: { display: "dmSerif", body: "nunito", script: "dancing" },
    radius: "soft",
  },
  // Florists, event decor, wedding and party styling
  "floral-elegant": {
    colors: {
      bg: "#f7f5f0",
      surface: "#ffffff",
      ink: "#1f2a24",
      text: "#2f3a33",
      muted: "#66706a",
      accent: "#7d5a6b",
      accentInk: "#ffffff",
      soft: "#e9e4dc",
      line: "#dcd6cc",
    },
    fonts: { display: "cormorant", body: "jost", script: "greatVibes" },
    radius: "sharp",
  },
  // Beauty, nail, lash, brow and hair salons, spas, makeup artists
  "salon-chic": {
    colors: {
      bg: "#faf6f4",
      surface: "#ffffff",
      ink: "#2a1f22",
      text: "#3b3033",
      muted: "#7b6c70",
      accent: "#a8647a",
      accentInk: "#ffffff",
      soft: "#f3e6e8",
      line: "#eadcdf",
    },
    fonts: { display: "cormorant", body: "montserrat", script: "parisienne" },
    radius: "soft",
  },
  // Barbers and men's grooming, dark (after Jatin Blendzz): black, bone and gold, condensed caps
  "barber-bold": {
    colors: {
      bg: "#0b0b0c",
      surface: "#141416",
      ink: "#f3efe6",
      text: "#dcd7cd",
      muted: "#a39f97",
      accent: "#c9a45c",
      accentInk: "#0b0b0c",
      soft: "#1d1d20",
      line: "#2a2a2e",
    },
    fonts: { display: "anton", body: "inter", script: "anton" },
    radius: "sharp",
    wordmark: "display",
    headingCase: "upper",
  },
  // Barbers, light variant (after Jatin Blendzz light): warm paper, ink and rust
  "barber-bold-light": {
    colors: {
      bg: "#f6f1e9",
      surface: "#fffcf6",
      ink: "#1b1a17",
      text: "#2c2a26",
      muted: "#6b655b",
      accent: "#9a3b22",
      accentInk: "#ffffff",
      soft: "#ece5d8",
      line: "#d9d0c1",
    },
    fonts: { display: "anton", body: "inter", script: "anton" },
    radius: "sharp",
    wordmark: "display",
    headingCase: "upper",
  },
  // Caterers, party trays, event and wedding food (after Little Bites v2)
  "catering-events": {
    colors: {
      bg: "#f6efe6",
      surface: "#fffaf6",
      ink: "#241614",
      text: "#3a2824",
      muted: "#5c463f",
      accent: "#9a3044",
      accentInk: "#fffaf6",
      soft: "#f3dfe2",
      line: "#e6d8c8",
    },
    fonts: { display: "dmSerif", body: "outfit", script: "parisienne" },
    radius: "soft",
    wordmark: "script",
  },
  // PREMIUM PRESETS. Quieter palettes, more air, hairline borders. Light by default.
  // Restaurants, burger and sandwich spots, grills, cafes, casual takeout: warm paper, charcoal and ember
  "restaurant-luxe": {
    colors: {
      bg: "#f6f0e6",
      surface: "#fffaf2",
      ink: "#1b1612",
      text: "#2f2822",
      muted: "#6e6257",
      accent: "#b5401c",
      accentInk: "#ffffff",
      soft: "#ece0cd",
      line: "#e0d3be",
    },
    fonts: { display: "anton", body: "outfit", script: "anton" },
    radius: "soft",
    wordmark: "display",
    headingCase: "upper",
  },
  // Restaurants, optional dark (night spots, smash burgers with moody photos): charcoal, cream and ember
  "restaurant-luxe-dark": {
    colors: {
      bg: "#12100e",
      surface: "#1a1714",
      ink: "#f6eee2",
      text: "#ddd4c6",
      muted: "#a69b8c",
      accent: "#e0662f",
      accentInk: "#12100e",
      soft: "#221e1a",
      line: "#302a24",
    },
    fonts: { display: "anton", body: "outfit", script: "anton" },
    radius: "soft",
    wordmark: "display",
    headingCase: "upper",
  },
  // Hair, beauty and brow salons, spas, makeup artists: ivory, espresso and champagne
  "salon-luxe": {
    colors: {
      bg: "#f7f3ee",
      surface: "#fffdfa",
      ink: "#1f1916",
      text: "#3a312c",
      muted: "#776a62",
      accent: "#8f6a4f",
      accentInk: "#ffffff",
      soft: "#ece4da",
      line: "#e2d8cc",
    },
    fonts: { display: "cormorant", body: "jost", script: "parisienne" },
    radius: "soft",
  },
  // Nail and lash studios: porcelain blush, plum ink and rose
  "nails-lash-luxe": {
    colors: {
      bg: "#fbf6f4",
      surface: "#ffffff",
      ink: "#2a1d24",
      text: "#3d3036",
      muted: "#7d6b72",
      accent: "#a85873",
      accentInk: "#ffffff",
      soft: "#f4e6ea",
      line: "#eddde1",
    },
    fonts: { display: "playfair", body: "outfit", script: "parisienne" },
    radius: "round",
  },
  // Barbers, light: warm stone, ink and bronze, condensed caps
  "barber-luxe": {
    colors: {
      bg: "#f2eee7",
      surface: "#fbf9f5",
      ink: "#161412",
      text: "#2b2825",
      muted: "#6a635a",
      accent: "#8a5a2b",
      accentInk: "#ffffff",
      soft: "#e6dfd3",
      line: "#d8cfc1",
    },
    fonts: { display: "anton", body: "inter", script: "anton" },
    radius: "sharp",
    wordmark: "display",
    headingCase: "upper",
  },
  // Barbers, optional dark: charcoal, bone and brass
  "barber-luxe-dark": {
    colors: {
      bg: "#0f0e0d",
      surface: "#171614",
      ink: "#f2ede4",
      text: "#d9d3c8",
      muted: "#a49d92",
      accent: "#c4a46c",
      accentInk: "#0f0e0d",
      soft: "#1f1d1a",
      line: "#2c2a26",
    },
    fonts: { display: "anton", body: "inter", script: "anton" },
    radius: "sharp",
    wordmark: "display",
    headingCase: "upper",
  },
  // Cakes and desserts: cream, cocoa and raspberry
  "bakery-luxe": {
    colors: {
      bg: "#fbf6ef",
      surface: "#fffdf9",
      ink: "#2a1c17",
      text: "#3f2f29",
      muted: "#7a665c",
      accent: "#a4566a",
      accentInk: "#ffffff",
      soft: "#f3e5e2",
      line: "#eadbd2",
    },
    fonts: { display: "playfair", body: "outfit", script: "greatVibes" },
    radius: "round",
  },
  // Caterers and event food: paper, oxblood and gold leaf
  "catering-luxe": {
    colors: {
      bg: "#f5efe7",
      surface: "#fffaf5",
      ink: "#221613",
      text: "#3a2a25",
      muted: "#6c5850",
      accent: "#8c2f3f",
      accentInk: "#fffaf5",
      soft: "#efe1dc",
      line: "#e3d5c6",
    },
    fonts: { display: "dmSerif", body: "outfit", script: "parisienne" },
    radius: "soft",
    wordmark: "script",
  },
};

export const radiusScale = {
  soft: { card: "1rem", pill: "999px", media: "1.25rem" },
  round: { card: "1.75rem", pill: "999px", media: "2rem" },
  sharp: { card: "0.25rem", pill: "0.25rem", media: "0.25rem" },
};
