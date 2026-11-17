import * as api from "@/api/WebContentApi";

const PAGE = "Footer";

const INFORMATION_KEYS = {
  location: "Address",
  phone: "Phone",
  email: "Email",
  schedule: "Schedule",
};

const SOCIAL_KEYS = ["Whatsapp", "Facebook", "Instagram", "Youtube"];

// Trae la información institucional del pie de página (administrable desde Contenido Web).
// Devuelve solo lo que exista y esté activo; quien lo usa completa lo que falte.
export const getFooter = async () => {
  const rows = await api.getPageContent(PAGE);

  const read = (sectionName, contentKey, field) => {
    const row = api.selectSection(rows, sectionName, contentKey)[0];

    return row ? JSON.parse(row.dataJson)?.[field] : undefined;
  };

  const information = {};

  Object.entries(INFORMATION_KEYS).forEach(([name, contentKey]) => {
    const label = read("Institución", contentKey, "label");

    if (label) information[name] = label;
  });

  const socials = SOCIAL_KEYS.map((name) => ({ name, url: read("Redes", name, "url") })).filter((social) => social.url);

  return { information, socials };
};
