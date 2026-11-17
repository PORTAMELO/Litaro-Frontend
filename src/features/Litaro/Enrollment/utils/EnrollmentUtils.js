import { parseDay } from "@/shared/utils/Dates";
import { colors } from "@/shared/styles/tokens";

export { formatDate, formatDateTime, formatDay, todayInColombia } from "@/shared/utils/Dates";

export const PAGE_SIZE = 50;

export const PRE_STATUS = {
  RESERVED: { label: "Sin respuesta", color: colors.warning },
  CONFIRMED: { label: "Confirmó", color: colors.success },
  DECLINED: { label: "No continúa", color: colors.textMuted },
  LOST: { label: "Perdió el cupo", color: colors.error },
};

export const ADMISSION_STATUS = {
  PENDING: { label: "Pendiente", color: colors.warning },
  WAITLIST: { label: "En lista de espera", color: colors.info },
  APPROVED: { label: "Aprobada", color: colors.success },
  REJECTED: { label: "Rechazada", color: colors.error },
};

export const ENROLLMENT_STATUS = {
  ACTIVE: { label: "Matriculado", color: colors.success },
  WITHDRAWN: { label: "Retirado", color: colors.textMuted },
  TRANSFERRED: { label: "Trasladado", color: colors.info },
  GRADUATED: { label: "Graduado", color: colors.primary },
  PROMOTED: { label: "Promovido", color: colors.success },
  FAILED: { label: "Reprobado", color: colors.error },
};

export const DOCUMENT_TYPES = ["RC", "TI", "CC", "CE", "NUIP", "PEP", "PPT"];

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
