const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

export const parseDay = (value) => {
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
