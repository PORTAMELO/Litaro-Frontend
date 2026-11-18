import { colors } from "@/shared/styles/tokens";
export const PERFORMANCE = {
  LOW: { label: "Bajo", color: colors.error },
  BASIC: { label: "Básico", color: colors.warning },
  HIGH: { label: "Alto", color: colors.success },
  SUPERIOR: { label: "Superior", color: colors.successText },
};

export const NEUTRAL_COLOR = colors.textDisabled;

export const CLOSING_RESULT = {
  PROMOTED: { label: "Promovido", color: colors.success },
  FAILED: { label: "Reprobado", color: colors.error },
  PENDING: { label: "Pendiente por notas", color: colors.warning },
};

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

export { openBlob } from "@/shared/utils/Files";
