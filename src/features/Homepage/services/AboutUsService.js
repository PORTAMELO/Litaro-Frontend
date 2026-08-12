import * as api from "../../../api/WebContentApi";

const getSection = async (sectionName, contentKey) => {
  const response = await api.getContent(
    "Nosotros",
    sectionName,
    contentKey
  );

  return response.map((item) => JSON.parse(item.dataJson));
};

export const getIntroduction = () =>
  getSection("Introducción", "Description");

export const getMission = () =>
  getSection("Misión y Visión", "Mission");

export const getVision = () =>
  getSection("Misión y Visión", "Vision");

export const getProfessors = () =>
  getSection("Profesores", "Cards");