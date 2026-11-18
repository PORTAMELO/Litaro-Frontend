import * as api from "@/api/WebContentApi";

const getSection = async (sectionName, contentKey) => {
  const response = api.selectSection(await api.getPageContent("Home"), sectionName, contentKey);

  return response.map((item) => JSON.parse(item.dataJson));
};

// Las plantillas de Contenido Web y los registros más antiguos usan nombres de campo
// distintos para lo mismo; aquí se leen ambos para que lo nuevo y lo viejo se vean igual.
const first = (...values) => values.find((value) => value !== undefined && value !== null && value !== "") ?? "";

export const getIntroduction = () => getSection("Introducción", "Description");

export const getLocations = () => getSection("Sedes", "Cards");

export const getAcademicLevels = () => getSection("Niveles Académicos", "Cards");

// Plantilla: category y asistants. Registros antiguos: label y grade.
export const getEvents = async () =>
  (await getSection("Eventos", "Cards")).map((event) => ({
    ...event,
    category: first(event.category, event.label),
    asistants: first(event.asistants, event.grade),
  }));

// Plantilla: value y label. Registros antiguos: title (cifra) y subtitle (nombre).
export const getStatistics = async () =>
  (await getSection("Estadisticas", "Statistics")).map((fact) => ({
    value: first(fact.value, fact.title),
    label: first(fact.label, fact.subtitle),
  }));

// Plantilla: label. Registros antiguos: title.
export const getValues = async () =>
  (await getSection("Valores", "Values")).map((value) => ({ label: first(value.label, value.title) }));
