// Solo una dirección web (http o https) se muestra como foto. Cualquier otro valor
// (vacío o un nombre de archivo de prueba) deja el recuadro de foto pendiente.
export const photoUrl = (value) => {
  const url = String(value ?? "").trim();

  return /^https?:\/\//i.test(url) ? url : null;
};
