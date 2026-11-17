// Única lista de URL de la aplicación. Van en español (sin tildes, que en una URL se
// codifican como %C3%B3) y ningún componente las escribe a mano.
// Las rutas de los módulos del portal están en features/Litaro/LitaroRoutes.js.
export const PATHS = {
  home: "/Inicio",
  aboutUs: "/Nosotros",
  calendar: "/Calendario",
  admissions: "/Admisiones",
  login: "/IniciarSesion",
  selectProfile: "/SeleccionarPerfil",
  unauthorized: "/SinAcceso",
  portal: "/Litaro",
  portalHome: "/Litaro/Inicio",
};

// URL anteriores que redirigen a las nuevas, por si alguien tiene un marcador guardado.
// React Router no distingue mayúsculas, así que "/login" también entra en "/Login".
export const LEGACY_PATHS = {
  "/Homepage": PATHS.home,
  "/Homepage/Inicio": PATHS.home,
  "/Homepage/Nosotros": PATHS.aboutUs,
  "/Homepage/Calendario": PATHS.calendar,
  "/Homepage/Admisiones": PATHS.admissions,
  "/Login": PATHS.login,
  "/unauthorized": PATHS.unauthorized,
  "/Litaro/Home": PATHS.portalHome,
};
