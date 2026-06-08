import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./shared/components/ScrollToTop";
import Homepage from "./features/Homepage/Homepage";
import Home from "./features/Homepage/Home/Home";
import AboutUs from "./features/Homepage/AboutUs/AboutUs";
import Calendar from "./features/Homepage/Calendar/Calendar";
import Admissions from "./features/Homepage/Admissions/Admissions";
import Login from "./features/Loginpage/Loginpage";
import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Navigate to="/Homepage" />} />
          <Route path="/Homepage" element={<Homepage />}>
            <Route index element={<Navigate to="Inicio" />} />
            <Route path="Inicio" element={<Home />} />
            <Route path="Nosotros" element={<AboutUs />} />
            <Route path="Calendario" element={<Calendar />} />
            <Route path="Admisiones" element={<Admissions />} />
          </Route>
            <Route path="Login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
