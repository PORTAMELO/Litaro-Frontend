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
  CLASS: { label: "Clase", color: "#2563eb", background: "#eff6ff" },
  PARENT_ATTENTION: { label: "Atención a padres", color: "#0f9d58", background: "#ecfdf3" },
  ACCOMPANIMENT: { label: "Zona de acompañamiento", color: "#d97706", background: "#fffbeb" },
  MEETING: { label: "Reunión", color: "#7c3aed", background: "#f5f3ff" },
  OTHER: { label: "Otro", color: "#6b7280", background: "#f3f4f6" },
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
