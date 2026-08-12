import * as api from "../../../api/WebContentApi";

const getSection = async (sectionName, contentKey) => {
  const response = await api.getContent(
    "Admisiones",
    sectionName,
    contentKey
  );

  return response.map((item) => JSON.parse(item.dataJson));
};

export const getIntroduction = () =>
  getSection("Introducción", "Description");

export const getSteps = () =>
  getSection("Pasos", "Cards");