import * as api from "../../../api/WebContentApi";

const getSection = async (sectionName, contentKey) => {
  const response = await api.getContent(
    "AboutUs",
    sectionName,
    contentKey
  );

  return response.map((item) => JSON.parse(item.dataJson));
};

export const getIntroduction = () =>
  getSection("Introduction", "Description");

export const getMission = () =>
  getSection("MissionVision", "Mission");

export const getVision = () =>
  getSection("MissionVision", "Vision");

export const getProfessors = () =>
  getSection("Professors", "Cards");