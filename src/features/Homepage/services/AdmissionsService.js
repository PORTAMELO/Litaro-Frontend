import * as api from "../../../api/WebContentApi";

const getSection = async (sectionName, contentKey) => {
  const response = await api.getContent(
    "Admissions",
    sectionName,
    contentKey
  );

  return response.map((item) => JSON.parse(item.dataJson));
};

export const getIntroduction = () =>
  getSection("Introduction", "Description");

export const getSteps = () =>
  getSection("Steps", "Cards");