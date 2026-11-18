import { colors } from "@/shared/styles/tokens";
import { parseDay } from "@/shared/utils/Dates";

export const REASON_LIMIT = 500;
export const CITATION_NOTE_LIMIT = 300;

export const CITATION_STATUSES = {
  TO_SCHEDULE: { label: "Por agendar", color: colors.warning },
  SCHEDULED: { label: "Agendada", color: colors.info },
  RESCHEDULED: { label: "Reprogramada", color: colors.textMuted },
  CLOSED: { label: "Cerrada", color: colors.success },
  CANCELLED: { label: "Cancelada", color: colors.error },
};

export const STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  ...Object.entries(CITATION_STATUSES).map(([value, { label }]) => ({ value, label })),
];

export const statusInfo = (status) => CITATION_STATUSES[status] ?? { label: status, color: colors.textMuted };

const DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const toDate = (value) => {
  const { year, month, day } = parseDay(value);
  return new Date(Date.UTC(year, month - 1, day));
};

const toText = (date) => date.toISOString().slice(0, 10);

// Día de la semana de una fecha "AAAA-MM-DD": 0 domingo … 6 sábado, igual que Schedule.Weekday.
export const weekdayOf = (value) => toDate(value).getUTCDay();

export const dayName = (weekday) => DAY_NAMES[weekday] ?? "";

export const addDays = (value, days) => {
  const date = toDate(value);
  date.setUTCDate(date.getUTCDate() + days);
  return toText(date);
};

// Lunes de la semana a la que pertenece la fecha.
export const mondayOf = (value) => addDays(value, -((weekdayOf(value) + 6) % 7));

// "10:00:00" → "10:00".
export const formatTime = (value) => (value ? String(value).slice(0, 5) : "");

export const slotLabel = (slot) =>
  `${dayName(slot.weekday)} ${formatTime(slot.startTime)}–${formatTime(slot.endTime)} · ${slot.campusName}`;

// Próxima fecha (desde hoy) que cae en el día de la franja.
export const nextDateFor = (weekday, today) => addDays(today, (weekday - weekdayOf(today) + 7) % 7);

export const missesText = (count) =>
  count === 1 ? "1 citación sin asistir" : `${count} citaciones seguidas sin asistir`;

export const plain = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
