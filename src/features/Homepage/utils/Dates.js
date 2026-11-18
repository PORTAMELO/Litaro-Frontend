// Fechas del sitio público. Los eventos llegan como "AAAA-MM-DD" y se leen en hora local.
export const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

export const SHORT_MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

export const capitalize = (text) => `${text.charAt(0).toUpperCase()}${text.slice(1)}`;

export const toKey = (date) => {
  if (typeof date === "string") return date.slice(0, 10);

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
};

// Devuelve null si el valor no es una fecha "AAAA-MM-DD".
export const parseKey = (value) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value ?? ""));

  return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null;
};

export const addDays = (date, amount) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);

// Lunes de la semana de `date` (getDay: 0 es domingo).
export const mondayOf = (date) => addDays(date, -((date.getDay() + 6) % 7));

export const startOfToday = () => {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

// "10 de octubre de 2026"; si no es una fecha válida, el texto tal cual.
export const longDate = (value) => {
  const date = parseKey(value);

  return date ? `${date.getDate()} de ${MONTHS[date.getMonth()]} de ${date.getFullYear()}` : String(value ?? "");
};

export const eventCount = (count) => (count === 1 ? "1 evento" : `${count} eventos`);
