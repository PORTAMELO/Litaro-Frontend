export const NOVELTY = {
  EVASION: { label: "Evasión", color: "#d97706" },
  TARDY: { label: "Tardanza", color: "#2563eb" },
  JUSTIFIED: { label: "Justificada", color: "#6b7280" },
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
