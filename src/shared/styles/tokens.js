// Única fuente de los valores de diseño (DESIGN.md).
// De aquí salen las variables CSS de :root (injectTokens) y el tema de MUI (LitaroTheme.js).
// Ningún otro archivo define colores, tamaños de texto, espaciados, radios ni sombras.

// Nivel primitivo: el valor en bruto, con nombre de tono. Solo se usa en este archivo.
const primitive = {
  navy900: "#16113a",
  navy800: "#262058",
  navyAlpha5: "rgba(22, 17, 58, 0.05)",
  navyAlpha8: "rgba(22, 17, 58, 0.08)",
  green500: "#0fd355",
  white: "#ffffff",
  whiteAlpha12: "rgba(255, 255, 255, 0.12)",
  whiteAlpha40: "rgba(255, 255, 255, 0.4)",
  gray50: "#f9fafb",
  gray400: "#9ca3af",
  gray500: "#6b7280",
  gray550: "#8a8f98",
  gray600: "#4b5563",
  gray900: "#111827",
  gray900Alpha40: "rgba(17, 24, 39, 0.4)",
  blackAlpha8: "rgba(0, 0, 0, 0.08)",
  green600: "#0f9d58",
  green700: "#15803d",
  green50: "#ecfdf3",
  amber600: "#d97706",
  amber700: "#b45309",
  amber50: "#fffbeb",
  red700: "#b91c1c",
  red50: "#fef2f2",
  blue600: "#2563eb",
  blue50: "#eff6ff",
};

// Nivel semántico: el uso. Es lo único que consumen los componentes.
export const colors = {
  primary: primitive.navy900,
  primaryHover: primitive.navy800,
  primaryTint: primitive.navyAlpha5,
  primaryTintStrong: primitive.navyAlpha8,
  accent: primitive.green500,
  background: primitive.gray50,
  surface: primitive.white,
  text: primitive.gray900,
  textSecondary: primitive.gray600,
  textMuted: primitive.gray500,
  textDisabled: primitive.gray400,
  border: primitive.blackAlpha8,
  borderInput: primitive.gray550,
  success: primitive.green600,
  successText: primitive.green700,
  successBg: primitive.green50,
  warning: primitive.amber600,
  warningText: primitive.amber700,
  warningBg: primitive.amber50,
  error: primitive.red700,
  errorBg: primitive.red50,
  info: primitive.blue600,
  infoBg: primitive.blue50,
  onPrimary: primitive.white,
  onPrimaryMuted: primitive.whiteAlpha40,
  onPrimaryTint: primitive.whiteAlpha12,
  // Fondo oscurecido detrás de un cajón o diálogo.
  scrim: primitive.gray900Alpha40,
};

export const fontFamily = '"Nunito", system-ui, sans-serif';

// Escala de texto (rem sobre 16 px). Nunca menos de 12 px.
export const text = {
  display: "2.5rem",
  displaySm: "2rem",
  headline: "1.5rem",
  title: "1.25rem",
  subtitle: "1.0625rem",
  body: "0.9375rem",
  label: "0.8125rem",
  caption: "0.75rem",
};

export const leading = {
  display: 1.15,
  displaySm: 1.2,
  headline: 1.25,
  title: 1.3,
  subtitle: 1.35,
  body: 1.5,
  label: 1.4,
  caption: 1.4,
};

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

// Cuadrícula de 4 px.
export const space = {
  xxs: "4px",
  xs: "8px",
  sm: "12px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  xxl: "48px",
  xxxl: "64px",
};

export const radius = {
  sm: "4px",
  md: "8px",
  lg: "16px",
  full: "999px",
};

export const shadow = {
  sm: "0 2px 8px rgba(0, 0, 0, 0.06)",
  md: "0 8px 16px rgba(0, 0, 0, 0.08)",
  lg: "0 8px 24px rgba(0, 0, 0, 0.12)",
};

export const controlHeight = { default: "40px", touch: "44px" };

export const layout = { sidebar: "240px", content: "1280px" };

export const breakpoints = { mobile: 600, tablet: 900, desktop: 1200 };

// --- Variables CSS ---------------------------------------------------------

const kebab = (name) => name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

const group = (prefix, values) =>
  Object.entries(values).map(([name, value]) => `--${prefix}-${kebab(name)}: ${value};`);

const cssVariables = () =>
  [
    ...group("color", colors),
    // Alias que DESIGN.md conserva con su nombre de siempre.
    `--color-muted: ${colors.textMuted};`,
    ...group("text", text),
    ...group("leading", leading),
    ...group("font", fontWeight),
    ...group("space", space),
    ...group("radius", radius),
    ...group("shadow", shadow),
    `--font-family: ${fontFamily};`,
    `--control-height: ${controlHeight.default};`,
    `--sidebar-width: ${layout.sidebar};`,
    `--content-max-width: ${layout.content};`,
  ].join("\n  ");

// Escribe las variables en :root. Se llama una vez en main.jsx, antes del primer render.
export const injectTokens = () => {
  const style = document.createElement("style");

  style.dataset.litaroTokens = "";
  style.textContent = `:root {\n  ${cssVariables()}\n}\n@media (pointer: coarse) {\n  :root { --control-height: ${controlHeight.touch}; }\n}\n`;

  document.head.prepend(style);
};
