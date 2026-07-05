import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./shared/components/ScrollToTop";
import PrivateRoute from "./shared/components/PrivateRoute";
import Homepage from "./features/Homepage/Homepage";
import Home from "./features/Homepage/Home/Home";
import AboutUs from "./features/Homepage/AboutUs/AboutUs";
import Calendar from "./features/Homepage/Calendar/Calendar";
import Admissions from "./features/Homepage/Admissions/Admissions";
import Login from "./features/Loginpage/Loginpage";
import "./App.css";

// Se deja momentaneo para mostrar el nombre del usuario en el dashboard temporal para verificar correcta autenticación y autorización de roles. Se eliminará cuando se implementen las rutas por rol.
import { useAuth } from "./shared/context/AuthContext";
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
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas por ROL*/}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']}>
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