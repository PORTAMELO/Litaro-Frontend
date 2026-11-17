import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "@/shared/components/ScrollToTop";
import PrivateRoute from "@/shared/components/PrivateRoute";
import RouteErrorBoundary from "@/shared/components/RouteErrorBoundary";
import { NotFound, Unauthorized } from "@/shared/components/StatusPage/StatusPage";
import { CardSkeleton, LayoutSkeleton } from "@/shared/components/Ui/Skeletons";
// Página pública
import Homepage from "./features/Homepage/Homepage";
import Home from "./features/Homepage/Home/Home";
import AboutUs from "./features/Homepage/AboutUs/AboutUs";
import Calendar from "./features/Homepage/Calendar/Calendar";
import Admissions from "./features/Homepage/Admissions/Admissions";
// Portal
import ModuleGuard from "./features/Litaro/components/ModuleGuard";
import { HomePage, LITARO_BASE, LITARO_HOME, litaroModules } from "./features/Litaro/LitaroRoutes";

const Login = lazy(() => import("./features/Loginpage/Loginpage"));
const SelectProfile = lazy(() => import("./features/SelectProfile/SelectProfile"));
const Litaro = lazy(() => import("./features/Litaro/Litaro"));

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <RouteErrorBoundary>
        <Routes>
          {/* Página pública */}
          <Route path="/" element={<Navigate to="/Homepage" replace />} />
          <Route path="/Homepage" element={<Homepage />}>
            <Route index element={<Navigate to="Inicio" replace />} />
            <Route path="Inicio" element={<Home />} />
            <Route path="Nosotros" element={<AboutUs />} />
            <Route path="Calendario" element={<Calendar />} />
            <Route path="Admisiones" element={<Admissions />} />
          </Route>

          <Route
            path="/Login"
            element={
              <Suspense fallback={<CardSkeleton />}>
                <Login />
              </Suspense>
            }
          />

          {/* Tras el login, si hay más de un perfil/rol disponible, PrivateRoute
              manda aquí en vez de al portal (ver PrivateRoute y AuthProvider). */}
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

          {/* Portal: exige sesión, y cada módulo exige además su permiso (ModuleGuard). */}
          <Route
            path={LITARO_BASE}
            element={
              <PrivateRoute>
                <Suspense fallback={<LayoutSkeleton />}>
                  <Litaro />
                </Suspense>
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to={LITARO_HOME} replace />} />
            <Route path={LITARO_HOME} element={<HomePage />} />
            {litaroModules.map((module) => {
              const Page = module.component;

              return (
                <Route
                  key={module.path}
                  path={module.path}
                  element={
                    <ModuleGuard keys={module.keys}>
                      <Page />
                    </ModuleGuard>
                  }
                />
              );
            })}
            <Route path="*" element={<NotFound actionTo={LITARO_BASE} />} />
          </Route>

          <Route path="/unauthorized" element={<Unauthorized fullScreen />} />
          <Route path="*" element={<NotFound fullScreen />} />
        </Routes>
      </RouteErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
