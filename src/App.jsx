import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./shared/components/ScrollToTop";
import PrivateRoute from "./shared/components/PrivateRoute";
import { useAuth } from "./shared/hooks/useAuth";
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
// Administradors
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

//Litaro
import Litaro from "./features/Litaro/Litaro";
import HomeLitaro from "./features/Litaro/Home/Home";
import AdministrationLitaro from "./features/Litaro/Administration/Administration";
import AttendanceLitaro from "./features/Litaro/Attendance/Attendance";
import CommunicationsLitaro from "./features/Litaro/Communications/Communications";
import ForumLitaro from "./features/Litaro/Forum/Forum";
import GradesLitaro from "./features/Litaro/Grades/Grades";
import ObservationsLitaro from "./features/Litaro/Observations/Observations";
import ReportsLitaro from "./features/Litaro/Reports/Reports";
import SecurityLitaro from "./features/Litaro/Security/Security";
import StatisticsLitaro from "./features/Litaro/Statistics/Statistics";
import WebpageLitaro from "./features/Litaro/Webpage/Webpage";

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
        <Route
          path="/Litaro"
          element={
            <PrivateRoute allowedRoles={["Administrador", "Profesor", "Estudiante", "Padre"]}>
              <Litaro />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="Home" replace />} />
          <Route path="Home" element={<HomeLitaro />} />
          <Route path="Administration" element={<AdministrationLitaro />} />
          <Route path="Attendance" element={<AttendanceLitaro />} />
          <Route path="Communications" element={<CommunicationsLitaro />} />
          <Route path="Forum" element={<ForumLitaro />} />
          <Route path="Grades" element={<GradesLitaro />} />
          <Route path="Observations" element={<ObservationsLitaro />} />
          <Route path="Reports" element={<ReportsLitaro />} />
          <Route path="Security" element={<SecurityLitaro />} />
          <Route path="Statistics" element={<StatisticsLitaro />} />
          <Route path="Webpage" element={<WebpageLitaro />} />
        </Route>
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
          <Route path="Observaciones" element={<ObservacionesCitacionesView />} />
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
          <Route path="Observaciones" element={<ObservacionesCitacionesProfessor />} />
          <Route path="Foro" element={<ForoProfessor />} />
        </Route>

        {/* Rutas protegidas por ROL*/}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={["Administrador", "Profesor", "Estudiante", "Padre"]}>
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