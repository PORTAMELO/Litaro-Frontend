import { colors } from "@/shared/styles/tokens";
export const WEEKDAYS = [
  { value: 1, label: "Lunes", short: "Lun" },
  { value: 2, label: "Martes", short: "Mar" },
  { value: 3, label: "Miércoles", short: "Mié" },
  { value: 4, label: "Jueves", short: "Jue" },
  { value: 5, label: "Viernes", short: "Vie" },
  { value: 6, label: "Sábado", short: "Sáb" },
];

export const dayLabel = (weekday) => WEEKDAYS.find((day) => day.value === weekday)?.label ?? "";

export const BLOCK_TYPES = {
  CLASS: { label: "Clase", color: colors.info, background: colors.infoBg },
  PARENT_ATTENTION: { label: "Atención a padres", color: colors.success, background: colors.successBg },
  ACCOMPANIMENT: { label: "Zona de acompañamiento", color: colors.warning, background: colors.warningBg },
  MEETING: { label: "Reunión", color: colors.primary, background: colors.primaryTintStrong },
  OTHER: { label: "Otro", color: colors.textMuted, background: colors.primaryTint },
};

export const typeInfo = (type) => BLOCK_TYPES[type] ?? BLOCK_TYPES.OTHER;

export const shortTime = (time) => (time ? time.slice(0, 5) : "");

const toMinutes = (time) => {
  const [hours, minutes] = shortTime(time).split(":").map(Number);
  return hours * 60 + minutes;
};

const fromMinutes = (total) => {
  const clamped = Math.min(total, 23 * 60 + 55);
  const hours = String(Math.floor(clamped / 60)).padStart(2, "0");
  const minutes = String(clamped % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const addMinutes = (time, minutes) => (time ? fromMinutes(toMinutes(time) + minutes) : "");

export const durationMinutes = (start, end) => (start && end ? toMinutes(end) - toMinutes(start) : 0);

export const blockTitle = (block) =>
  block.type === "CLASS" ? (block.subjectName ?? "Clase") : (block.title ?? typeInfo(block.type).label);

export const sortBlocks = (blocks) =>
  [...blocks].sort((a, b) => a.weekday - b.weekday || a.startTime.localeCompare(b.startTime));
