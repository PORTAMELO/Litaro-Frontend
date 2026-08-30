import { useCallback, useEffect, useState } from "react";

import { logoutRequest, sessionRequest } from "../../api/auth";

import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const session = await sessionRequest();

        setUser(session);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Guardar usuario después de iniciar sesión
  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  // Cerrar sesión
  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
      window.location.href = "/login";
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
