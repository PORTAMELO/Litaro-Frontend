// Arma el texto de consulta de una URL ("?a=1&b=2") a partir de un objeto.
// Omite los valores vacíos (null, undefined y ""); conserva 0 y false.
export const toQuery = (params) => {
  const search = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") search.set(key, value);
  });

  const text = search.toString();

  return text ? `?${text}` : "";
};
