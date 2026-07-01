export const API_BASE_URL = import.meta.env.VITE_API_URL;

export const apiFetch = async (endpoint, options = {}, isAuthCall = false) => {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (res.status === 401) {
    if (isAuthCall) {
      throw new Error('Credenciales incorrectas');
    }
    window.location.href = '/login';
    return;
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? 'Error en la petición');
  }

  if (res.status === 204) return null;

  return res.json();
};