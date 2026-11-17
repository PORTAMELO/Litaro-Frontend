import { information as defaultInformation, socials as defaultSocials } from "./HomePageData.js";
import { Outlet } from "react-router-dom";
import { useLoad } from "@/shared/hooks/useLoad";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MobileNavigation from "./components/MobileNavigation.jsx";
import { getFooter } from "./services/FooterService.js";

const Homepage = () => {
  // El pie de página se administra desde Contenido Web ("Información institucional").
  // Mientras carga, o si falla, se muestran los valores por defecto.
  const { data } = useLoad(getFooter);

  const information = { ...defaultInformation, ...data?.information };
  const socials = data?.socials?.length ? data.socials : defaultSocials;

  return (
    <>
      <Header />
      <Outlet />
      <Footer information={information} socials={socials} />
      <MobileNavigation />
    </>
  );
};

export default Homepage;
