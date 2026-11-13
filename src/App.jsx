import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./shared/components/ScrollToTop";
import PrivateRoute from "./shared/components/PrivateRoute";
import RouteErrorBoundary from "./shared/components/RouteErrorBoundary";
import { useAuth } from "./shared/hooks/UseAuth";
import { CardSkeleton, LayoutSkeleton } from "./shared/components/Ui/Skeletons";
import "./App.css";
// Webpage
import Homepage from "./features/Homepage/Homepage";
import Home from "./features/Homepage/Home/Home";
import AboutUs from "./features/Homepage/AboutUs/AboutUs";
import Calendar from "./features/Homepage/Calendar/Calendar";
import Admissions from "./features/Homepage/Admissions/Admissions";
// Login y rutas
const Login = lazy(() => import("./features/Loginpage/Loginpage"));
const SelectProfile = lazy(() => import("./features/SelectProfile/SelectProfile"));
const LitaroAdmin = lazy(() => import("./features/LitaroAdmin/LitaroAdmin"));
const LitaroProfessor = lazy(() => import("./features/LitaroProfessor/LitaroProfessor"));
const LitaroStudent = lazy(() => import("./features/LitaroStudent/LitaroStudent"));
// Administradors
const AdministracionView = lazy(() => import("./features/LitaroAdmin/Administracion/AdministracionView"));
const NotasView = lazy(() => import("./features/LitaroAdmin/Notas/NotasView"));
const AsistenciaView = lazy(() => import("./features/LitaroAdmin/Asistencia/AsistenciaView"));
const ObservacionesCitacionesView = lazy(() => import("./features/LitaroAdmin/Observaciones/ObservacionesCitacionesView"));
const EstadisticasView = lazy(() => import("./features/LitaroAdmin/Estadisticas/EstadisticasView"));
const ComunicacionesView = lazy(() => import("./features/LitaroAdmin/Comunicaciones/ComunicacionesView"));
const ForoView = lazy(() => import("./features/LitaroAdmin/Foro/ForoView"));
const ReportesView = lazy(() => import("./features/LitaroAdmin/Reportes/ReportesView"));
const SeguridadView = lazy(() => import("./features/LitaroAdmin/Seguridad/SeguridadView"));
const WebContentManager = lazy(() => import("./features/LitaroAdmin/WebContentManager/WebContentManager"));
//Student

//Professor
const InicioProfessor = lazy(() => import("./features/LitaroProfessor/Inicio/InicioProfessor"));
const NotasProfessor = lazy(() => import("./features/LitaroProfessor/Notas/NotasProfessor"));
const AsistenciaProfessor = lazy(() => import("./features/LitaroProfessor/Asistencia/AsistenciaProfessor"));
const ObservacionesCitacionesProfessor = lazy(() => import("./features/LitaroProfessor/Observaciones/ObservacionesCitacionesProfessor"));
const ForoProfessor = lazy(() => import("./features/LitaroProfessor/Foro/ForoProfessor"));

//Litaro
const Litaro = lazy(() => import("./features/Litaro/Litaro"));
const HomeLitaro = lazy(() => import("./features/Litaro/Home/Home"));
const AdministrationLitaro = lazy(() => import("./features/Litaro/Administration/Administration"));
const AttendanceLitaro = lazy(() => import("./features/Litaro/Attendance/Attendance"));
const CommunicationsLitaro = lazy(() => import("./features/Litaro/Communications/Communications"));
const ForumLitaro = lazy(() => import("./features/Litaro/Forum/Forum"));
const GradesLitaro = lazy(() => import("./features/Litaro/Grades/Grades"));
const ObservationsLitaro = lazy(() => import("./features/Litaro/Observations/Observations"));
const ReportsLitaro = lazy(() => import("./features/Litaro/Reports/Reports"));
const SecurityLitaro = lazy(() => import("./features/Litaro/Security/Security"));
const StatisticsLitaro = lazy(() => import("./features/Litaro/Statistics/Statistics"));
const WebpageLitaro = lazy(() => import("./features/Litaro/Webpage/Webpage"));
const ScheduleLitaro = lazy(() => import("./features/Litaro/Schedule/Schedule"));
const EnrollmentLitaro = lazy(() => import("./features/Litaro/Enrollment/Enrollment"));
const NotificationsLitaro = lazy(() => import("./features/Litaro/Notifications/Notifications"));

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
      <RouteErrorBoundary>
      <Routes>
        {/* Tras el login, si hay más de un perfil/rol disponible, PrivateRoute
            manda aquí en vez de a /Litaro (ver PrivateRoute y AuthProvider). */}
        <Route
          path="/SeleccionarPerfil"
          element={
            <PrivateRoute requireRole={false} fallback={<CardSkeleton />}>
              <Suspense fallback={<CardSkeleton />}>
                <SelectProfile />
              </Suspense>
            </PrivateRoute>
          }
        />

        <Route
          path="/Litaro"
          element={
            <PrivateRoute>
              <Suspense fallback={<LayoutSkeleton />}>
                <Litaro />
              </Suspense>
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
          <Route path="Schedule" element={<ScheduleLitaro />} />
          <Route path="Enrollment" element={<EnrollmentLitaro />} />
          <Route path="Notifications" element={<NotificationsLitaro />} />
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
        <Route path="/Login" element={<Suspense fallback={<CardSkeleton />}><Login /></Suspense>} />
        <Route path="/LitaroAdmin" element={<Suspense fallback={<LayoutSkeleton />}><LitaroAdmin /></Suspense>}>
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
        <Route path="/LitaroStudent" element={<Suspense fallback={<LayoutSkeleton />}><LitaroStudent /></Suspense>}></Route>
        <Route path="/LitaroProfessor" element={<Suspense fallback={<LayoutSkeleton />}><LitaroProfessor /></Suspense>}>
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
            <PrivateRoute allowedRoles={["Administrador", "Profesor", "Estudiante", "Acudiente"]}>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Aquí van las rutas por rol*/}
      </Routes>
      </RouteErrorBoundary>
    </BrowserRouter>
  );
}

export default App;