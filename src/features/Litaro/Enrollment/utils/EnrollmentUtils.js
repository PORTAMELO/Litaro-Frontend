export const STAFF_ROLES = ["Administrador", "Secretaría", "Secretaria"];
export const RECTOR_ROLES = ["Rector"];
export const VIEWER_ROLES = [...STAFF_ROLES, ...RECTOR_ROLES];

export const hasAnyRole = (user, names) => (user?.roles ?? []).some((role) => names.includes(role));

export const PAGE_SIZE = 50;

export const PRE_STATUS = {
  RESERVED: { label: "Sin respuesta", color: "#d97706" },
  CONFIRMED: { label: "Confirmó", color: "#0f9d58" },
  DECLINED: { label: "No continúa", color: "#6b7280" },
  LOST: { label: "Perdió el cupo", color: "#b91c1c" },
};

export const ADMISSION_STATUS = {
  PENDING: { label: "Pendiente", color: "#d97706" },
  WAITLIST: { label: "En lista de espera", color: "#2563eb" },
  APPROVED: { label: "Aprobada", color: "#0f9d58" },
  REJECTED: { label: "Rechazada", color: "#b91c1c" },
};

export const ALERT_TYPE = {
  ADMISSION_APPROVED: { label: "Admisión aprobada", color: "#0f9d58" },
  CUPO_RELEASED: { label: "Cupo liberado", color: "#d97706" },
  NOT_IN_SIMAT: { label: "No está en el SIMAT", color: "#2563eb" },
};

export const DOCUMENT_TYPES = ["RC", "TI", "CC", "CE", "NUIP", "PEP", "PPT"];

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

const parseDay = (value) => {
  const [year, month, day] = String(value).slice(0, 10).split("-").map(Number);
  return { year, month, day };
};

export const todayInColombia = () => new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });

export const formatDay = (value) => {
  if (!value) return "";

  const { month, day } = parseDay(value);
  return `${day} ${MONTHS[month - 1]}`;
};

export const formatDate = (value) => {
  if (!value) return "";

  const { year, month, day } = parseDay(value);
  return `${day} ${MONTHS[month - 1]} ${year}`;
};

export const formatDateTime = (value) => {
  if (!value) return "";

  const date = new Date(value);
  const sameYear = date.getFullYear() === new Date().getFullYear();
  const time = date.toLocaleTimeString("es-CO", { hour: "numeric", minute: "2-digit" });

  return `${date.getDate()} ${MONTHS[date.getMonth()]}${sameYear ? "" : ` ${date.getFullYear()}`}, ${time}`;
};

const toUtc = (value) => {
  const { year, month, day } = parseDay(value);
  return Date.UTC(year, month - 1, day);
};

const DAY_MS = 24 * 60 * 60 * 1000;

export const daysBetween = (from, to) => Math.round((toUtc(to) - toUtc(from)) / DAY_MS);

export const ageAt = (birthDate, today) => {
  const birth = parseDay(birthDate);
  const now = parseDay(today);
  const beforeBirthday = now.month < birth.month || (now.month === birth.month && now.day < birth.day);

  return now.year - birth.year - (beforeBirthday ? 1 : 0);
};

export const windowState = (start, end, today) => {
  if (!start || !end) return null;

  if (today < start) return { phase: "before", progress: 0, daysLeft: daysBetween(today, end) };
  if (today > end) return { phase: "closed", progress: 1, daysLeft: 0 };

  const total = Math.max(daysBetween(start, end), 1);
  const elapsed = daysBetween(start, today);

  return { phase: "open", progress: Math.min(Math.max(elapsed / total, 0), 1), daysLeft: daysBetween(today, end) };
};

const plain = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export const matchesQuery = (query, ...values) => {
  const text = plain(query.trim());
  if (text === "") return true;

  return values.some((value) => plain(value).includes(text));
};

export const countBy = (rows, getKey) =>
  rows.reduce((totals, row) => {
    const key = getKey(row);
    return { ...totals, [key]: (totals[key] ?? 0) + 1 };
  }, {});

export const plural = (count, one, many) => (count === 1 ? one : many);
