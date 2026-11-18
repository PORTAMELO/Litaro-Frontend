import colegio from "@/assets/colegio.jpeg";

// Fotos que vienen con el proyecto: en Contenido Web se escribe su nombre (p. ej. "colegio").
const LOCAL_IMAGES = { colegio };

// Una foto puede ser el nombre de una imagen del proyecto o una dirección web (http o https).
// Cualquier otro valor (vacío o desconocido) deja el recuadro de foto pendiente.
export const photoUrl = (value) => {
  const text = String(value ?? "").trim();

  if (LOCAL_IMAGES[text]) return LOCAL_IMAGES[text];

  return /^https?:\/\//i.test(text) ? text : null;
};
