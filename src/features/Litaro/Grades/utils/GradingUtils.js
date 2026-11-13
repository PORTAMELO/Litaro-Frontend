export const PERFORMANCE = {
  LOW: { label: "Bajo", color: "#c98a8a" },
  BASIC: { label: "Básico", color: "#d4b26a" },
  HIGH: { label: "Alto", color: "#9cbf8f" },
  SUPERIOR: { label: "Superior", color: "#5f9e6e" },
};

export const NEUTRAL_COLOR = "#b8b8c2";

export const COMPONENTS = {
  HETERO: "HETERO",
  SABER: "SABER",
  SELF: "SELF",
  PEER: "PEER",
};

export const FIXED_COMPONENTS = [
  { component: COMPONENTS.SABER, label: "Saber" },
  { component: COMPONENTS.SELF, label: "Auto" },
  { component: COMPONENTS.PEER, label: "Co" },
];

export const MODES = {
  WEIGHTED: "WEIGHTED",
  AVERAGE: "AVERAGE",
};

const COLOMBIA_OFFSET_MS = 5 * 60 * 60 * 1000;

const pad = (value) => String(value).padStart(2, "0");

export const formatGrade = (value) =>
  value === null || value === undefined ? "" : Number(value).toFixed(2).replace(".", ",");

export const formatRaw = (value) =>
  value === null || value === undefined ? "" : String(Number(value)).replace(".", ",");

export const formatPercent = (value) => `${String(Number(value ?? 0)).replace(".", ",")} %`;

export const parseRaw = (text) => {
  const clean = String(text ?? "").trim().replace(",", ".");

  if (clean === "") return null;

  return /^\d{1,2}(\.\d)?$/.test(clean) ? Number(clean) : Number.NaN;
};

export const isValidRaw = (text) => {
  const value = parseRaw(text);

  return value === null || (!Number.isNaN(value) && value >= 10 && value <= 50);
};

export const toColombiaInput = (isoUtc) => {
  if (!isoUtc) return "";

  return new Date(new Date(isoUtc).getTime() - COLOMBIA_OFFSET_MS).toISOString().slice(0, 16);
};

export const fromColombiaInput = (value) => (value ? `${value}:00-05:00` : null);

export const formatColombiaDateTime = (isoUtc) => {
  if (!isoUtc) return "";

  const local = new Date(new Date(isoUtc).getTime() - COLOMBIA_OFFSET_MS);

  return `${pad(local.getUTCDate())}/${pad(local.getUTCMonth() + 1)}/${local.getUTCFullYear()} ${pad(local.getUTCHours())}:${pad(local.getUTCMinutes())}`;
};

export const openBlob = (blob) => {
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener");
  setTimeout(() => URL.revokeObjectURL(url), 60000);
};
