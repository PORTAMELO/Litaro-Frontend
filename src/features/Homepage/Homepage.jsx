import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

const information = {
  location: "Carrera 11 #18 - 29 Villeta, Cundinamarca",
  phone: "+57 (601)6714440",
  email: "inpromocionsocial@inps.edu.co",
  schedule: "Lunes a viernes de 09:00 am a 05:00 pm",
};

const socials = [
  { name: "Whatsapp", url: "https://wa.me/573165053574" },
  { name: "Facebook", url: "https://www.facebook.com" },
  { name: "Instagram", url: "https://www.instagram.com" },
  { name: "Youtube", url: "https://www.youtube.com" },
];

const Homepage = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer information={information} socials={socials} />
    </>
  );
};

export default Homepage;
