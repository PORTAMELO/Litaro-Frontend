import * as api from "../../../api/WebContentApi";

const getSection = async (sectionName, contentKey) => {
  const response = await api.getContent(
    "Calendario",
    sectionName,
    contentKey
  );

  return response.map((item) => JSON.parse(item.dataJson));
};

export const getEvents = () =>
  getSection("Eventos", "Cards");