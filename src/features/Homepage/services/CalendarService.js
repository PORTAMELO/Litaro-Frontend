import * as api from "../../../api/WebContentApi";

const getSection = async (sectionName, contentKey) => {
  const response = await api.getContent(
    "Calendar",
    sectionName,
    contentKey
  );

  return response.map((item) => JSON.parse(item.dataJson));
};

export const getEvents = () =>
  getSection("Events", "Cards");