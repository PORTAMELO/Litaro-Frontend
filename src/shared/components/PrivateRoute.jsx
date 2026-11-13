import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth";
import { LayoutSkeleton } from "./Ui/Skeletons";

function PrivateRoute({ children, allowedRoles, requireRole = true, fallback = <LayoutSkeleton /> }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return fallback;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole && !user.role) {
    return <Navigate to="/SeleccionarPerfil" replace />;
  }

  if (allowedRoles && user.role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default PrivateRoute;
