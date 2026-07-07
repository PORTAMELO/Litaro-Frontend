import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./shared/components/ScrollToTop";
import PrivateRoute from "./shared/components/PrivateRoute";
import Homepage from "./features/Homepage/Homepage";
import Home from "./features/Homepage/Home/Home";
import AboutUs from "./features/Homepage/AboutUs/AboutUs";
import Calendar from "./features/Homepage/Calendar/Calendar";
import Admissions from "./features/Homepage/Admissions/Admissions";
import Login from "./features/Loginpage/Loginpage";
import LitaroAdmin from "./features/Litaro/LitaroAdmin";
import AdministracionView from "./features/Litaro/Administracion/AdministracionView";
import EstadisticasView from "./features/Litaro/Estadisticas/EstadisticasView";
import "./App.css";
import { useAuth } from "./shared/context/AuthContext";
import WebContentManager from "./features/Litaro/WebContentManager/WebContentManager";

function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <div>
      <h1>Bienvenido, {user?.firstName}</h1>
      <p>Rol: {user?.role}</p>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Rutas públicas ── */}
        <Route path="/" element={<Navigate to="/Homepage" />} />
        <Route path="/Homepage" element={<Homepage />}>
          <Route index element={<Navigate to="Inicio" />} />
          <Route path="Inicio" element={<Home />} />
          <Route path="Nosotros" element={<AboutUs />} />
          <Route path="Calendario" element={<Calendar />} />
          <Route path="Admisiones" element={<Admissions />} />
        </Route>
        <Route path="/Login" element={<Login />} />
        <Route path="/Litaro" element={<LitaroAdmin />}>
          <Route index element={<Navigate to="Administracion" />} />
          <Route path="Administracion" element={<AdministracionView />} />
          <Route path="Estadisticas" element={<EstadisticasView />} />
          <Route path="PaginaWeb" element={<WebContentManager />} />
        </Route>

        {/* Rutas protegidas por ROL*/}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute
              allowedRoles={["ADMIN", "TEACHER", "STUDENT", "PARENT"]}
            >
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Aquí van las rutas por rol*/}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
