// Interpreta el valor del mapa de una sede tal como se guarda en Contenido Web.
//
// Google no deja mostrar dentro de un iframe ni el enlace de compartir
// (maps.app.goo.gl) ni la página normal de Maps: solo la URL de "Insertar mapa" o
// una URL armada con coordenadas. Por eso:
//   - URL de inserción o código <iframe> de Google  -> { embed }
//   - enlace largo de Maps con coordenadas           -> { embed } armado con ellas
//   - enlace de compartir u otro enlace de Maps      -> { link } (se abre en otra pestaña)
//   - cualquier otro valor                           -> null
// Un valor que no sea una URL de Google nunca llega al iframe: dentro de él se
// abriría una página de Litaro y la portada se cargaría en bucle.

const EMBED_PREFIXES = ["https://www.google.com/maps/embed", "https://maps.google.com/maps/embed"];
const MAPS_HOSTS = ["maps.app.goo.gl", "goo.gl", "www.google.com", "google.com", "maps.google.com"];

const COORDINATES = [
  /@(-?\d{1,3}\.\d+),(-?\d{1,3}\.\d+)/, // /maps/place/...@4.66,-74.06,17z
  /\/maps\/search\/(-?\d{1,3}\.\d+),\+?(-?\d{1,3}\.\d+)/, // /maps/search/4.66,+-74.06
  /[?&](?:q|query|ll)=(-?\d{1,3}\.\d+),\+?(-?\d{1,3}\.\d+)/, // ?q=4.66,-74.06
];

const embedFromCoordinates = (latitude, longitude) =>
  `https://www.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`;

const parseUrl = (text) => {
  try {
    const url = new URL(text);
    return url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
};

export const parseMapLink = (value) => {
  const text = String(value ?? "").trim();
  const candidate = text.startsWith("<") ? (text.match(/src\s*=\s*["']([^"']+)["']/i)?.[1] ?? "") : text;
  const url = parseUrl(candidate);

  if (!url || !MAPS_HOSTS.includes(url.hostname)) return null;

  if (EMBED_PREFIXES.some((prefix) => candidate.startsWith(prefix))) return { embed: candidate };

  const isMapsLink =
    url.hostname.endsWith("goo.gl") || url.hostname === "maps.google.com" || url.pathname.startsWith("/maps");
  if (!isMapsLink) return null;

  const decoded = decodeURIComponent(candidate);

  for (const pattern of COORDINATES) {
    const match = decoded.match(pattern);
    if (match) return { embed: embedFromCoordinates(match[1], match[2]), link: candidate };
  }

  return { link: candidate };
};
