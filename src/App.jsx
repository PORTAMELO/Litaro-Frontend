import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./shared/components/ScrollToTop";
import PrivateRoute from "./shared/components/PrivateRoute";
import { useAuth } from "./shared/context/AuthContext";
import "./App.css";
// Webpage
import Homepage from "./features/Homepage/Homepage";
import Home from "./features/Homepage/Home/Home";
import AboutUs from "./features/Homepage/AboutUs/AboutUs";
import Calendar from "./features/Homepage/Calendar/Calendar";
import Admissions from "./features/Homepage/Admissions/Admissions";
// Login y rutas
import Login from "./features/Loginpage/Loginpage";
import LitaroAdmin from "./features/LitaroAdmin/LitaroAdmin";
import LitaroProfessor from "./features/LitaroProfessor/LitaroProfessor";
import LitaroStudent from "./features/LitaroStudent/LitaroStudent";
// Administrador
import AdministracionView from "./features/LitaroAdmin/Administracion/AdministracionView";
import NotasView from "./features/LitaroAdmin/Notas/NotasView";
import AsistenciaView from "./features/LitaroAdmin/Asistencia/AsistenciaView";
import ObservacionesCitacionesView from "./features/LitaroAdmin/Observaciones/ObservacionesCitacionesView";
import EstadisticasView from "./features/LitaroAdmin/Estadisticas/EstadisticasView";
import ComunicacionesView from "./features/LitaroAdmin/Comunicaciones/ComunicacionesView";
import ForoView from "./features/LitaroAdmin/Foro/ForoView";
import ReportesView from "./features/LitaroAdmin/Reportes/ReportesView";
import SeguridadView from "./features/LitaroAdmin/Seguridad/SeguridadView";
import WebContentManager from "./features/LitaroAdmin/WebContentManager/WebContentManager";
//Student

//Professor
import InicioProfessor from "./features/LitaroProfessor/Inicio/InicioProfessor";
import NotasProfessor from "./features/LitaroProfessor/Notas/NotasProfessor";
import AsistenciaProfessor from "./features/LitaroProfessor/Asistencia/AsistenciaProfessor";
import ObservacionesCitacionesProfessor from "./features/LitaroProfessor/Observaciones/ObservacionesCitacionesProfessor";
import ForoProfessor from "./features/LitaroProfessor/Foro/ForoProfessor";

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
        <Route path="/LitaroAdmin" element={<LitaroAdmin />}>
          <Route index element={<Navigate to="Administracion" />} />
          <Route path="Administracion" element={<AdministracionView />} />
          <Route path="Notas" element={<NotasView />} />
          <Route path="Asistencia" element={<AsistenciaView />} />
          <Route
            path="Observaciones"
            element={<ObservacionesCitacionesView />}
          />
          <Route path="Estadisticas" element={<EstadisticasView />} />
          <Route path="Comunicaciones" element={<ComunicacionesView />} />
          <Route path="Foro" element={<ForoView />} />
          <Route path="Reportes" element={<ReportesView />} />
          <Route path="Seguridad" element={<SeguridadView />} />
          <Route path="PaginaWeb" element={<WebContentManager />} />
        </Route>
        <Route path="/LitaroStudent" element={<LitaroStudent />}></Route>
        <Route path="/LitaroProfessor" element={<LitaroProfessor />}>
          <Route index element={<Navigate to="Inicio" />} />
          <Route path="Inicio" element={<InicioProfessor />} />
          <Route path="Notas" element={<NotasProfessor />} />
          <Route path="Asistencia" element={<AsistenciaProfessor />} />
          <Route
            path="Observaciones"
            element={<ObservacionesCitacionesProfessor />}
          />
          <Route path="Foro" element={<ForoProfessor />} />
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
