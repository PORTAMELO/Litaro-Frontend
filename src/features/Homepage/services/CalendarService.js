import * as api from "../../../api/WebContentApi";

const getSection = async (sectionName, contentKey) => {
  const response = await api.getContent(
    "Calendario",
    sectionName,
    contentKey
  );

  return response.map((item) => JSON.parse(item.dataJson));
};


const formatTime = (time) => {
  if (!time) return "";

  const [h, m] = time.split(":").map(Number);

  if (Number.isNaN(h) || Number.isNaN(m)) return time;

  const period = h >= 12 ? "p. m." : "a. m.";
  const hour12 = h % 12 === 0 ? 12 : h % 12;

  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
};

// Texto del horario
const buildSchedule = ({ startTime, endTime, duration }) => {
  if (startTime && endTime) {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  }

  if (startTime) {
    return `Desde las ${formatTime(startTime)}`;
  }

  return duration || "Todo el día";
};

// Eventos
const normalizeEvent = (event) => ({
  ...event,
  responsible: event.responsible || event.category || "",
  schedule: buildSchedule(event),
});

export const getEvents = async () => {
  const events = await getSection("Eventos", "Cards");

  return events.map(normalizeEvent);
};