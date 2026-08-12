import * as api from "../../../api/WebContentApi";

const getSection = async (sectionName, contentKey) => {
  const response = await api.getContent(
    "Home",
    sectionName,
    contentKey
  );

  return response.map((item) =>
    JSON.parse(item.dataJson)
  );
};

export const getIntroduction = () =>
  getSection("Introducción", "Description");

export const getLocations = () =>
  getSection("Sedes", "Cards");

export const getAcademicLevels = () =>
  getSection("Niveles Académicos", "Cards");

export const getEvents = () =>
  getSection("Eventos", "Cards");

export const getStatistics = () =>
  getSection("Tarjetas", "Statistics");

export const getValues = () =>
  getSection("Tarjetas", "Values");
