import { useCallback, useEffect, useState } from "react";

import { logoutRequest, sessionRequest } from "../../api/auth";
import { permissionsRequest } from "../../api/Permissions";
import { getRoleOptions } from "../utils/profileOptions";

import { AuthContext } from "./AuthContext";

const ACTIVE_ROLE_KEY = "litaro_active_role";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState(null);

  const applyRole = useCallback((sessionData) => {
    const options = getRoleOptions(sessionData);
    const remembered = sessionStorage.getItem(ACTIVE_ROLE_KEY);
    const rememberedOption = options.find((option) => option.role === remembered);

    let role = null;

    if (rememberedOption) {
      role = rememberedOption.role;
    } else if (options.length === 1) {
      role = options[0].role;
      sessionStorage.setItem(ACTIVE_ROLE_KEY, role);
    }

    return { ...sessionData, role };
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const session = await sessionRequest();
        setUser(session ? applyRole(session) : null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    permissionsRequest()
      .then((data) => {
        if (!cancelled) setPermissions(data?.permissions ?? []);
      })
      .catch(() => {
        if (!cancelled) setPermissions([]);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const login = useCallback(
    (sessionData) => {
      setUser(applyRole(sessionData));
    },
    [applyRole]
  );

  const chooseRole = useCallback((role) => {
    setUser((previous) => {
      if (!previous) return previous;

      const isValid = getRoleOptions(previous).some((option) => option.role === role);
      if (!isValid) return previous;

      sessionStorage.setItem(ACTIVE_ROLE_KEY, role);
      return { ...previous, role };
    });
  }, []);

  const clearChosenRole = useCallback(() => {
    sessionStorage.removeItem(ACTIVE_ROLE_KEY);
    setUser((previous) => (previous ? { ...previous, role: null } : previous));
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      sessionStorage.removeItem(ACTIVE_ROLE_KEY);
      setUser(null);
      window.location.href = "/login";
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        permissions,
        login,
        logout,
        chooseRole,
        clearChosenRole,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}