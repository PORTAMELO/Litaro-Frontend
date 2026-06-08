import { information, socials } from "./HomePageData.js";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MobileNavigation from "./components/MobileNavigation.jsx";

const Homepage = () => {
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
