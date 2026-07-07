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
  getSection("Introduction", "Description");

export const getLocations = () =>
  getSection("Locations", "Cards");

export const getAcademicLevels = () =>
  getSection("Levels", "Cards");

export const getEvents = () =>
  getSection("Events", "Cards");

export const getStatistics = () =>
  getSection("Banners", "Statistics");

export const getValues = () =>
  getSection("Banners", "Values");
