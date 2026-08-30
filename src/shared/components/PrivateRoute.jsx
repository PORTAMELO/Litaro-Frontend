import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function PrivateRoute({ children, allowedRoles }) {
  const { user, loading, isAuthenticated } = useAuth();

  // Todavía estamos comprobando la sesión
  if (loading) {
    return null;
  }

  // Terminamos de comprobar y no hay sesión
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Hay sesión, pero el usuario no tiene el rol necesario
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Todo correcto
  return children;
}

export default PrivateRoute;
