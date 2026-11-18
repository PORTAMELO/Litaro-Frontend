import { colors } from "@/shared/styles/tokens";
export const NOVELTY = {
  EVASION: { label: "Evasión", color: colors.warning },
  TARDY: { label: "Tardanza", color: colors.info },
  JUSTIFIED: { label: "Justificada", color: colors.textMuted },
};

export const OBSERVATION_LIMIT = 500;

export const REASON_LIMIT = 300;

export const formatTime = (value) => {
  if (!value) return "";

  const [hours, minutes] = String(value).split(":");

  return `${Number(hours)}:${minutes}`;
};

export const formatHours = (value) => Number(value ?? 0).toLocaleString("es-CO", { maximumFractionDigits: 1 });

export const slotKey = (item) => `${item.classroomId}|${item.startTime ?? "daily"}`;

export const localDateTime = (date, time) => `${date}T${time}:00`;
