import { getSessionSignal, handleUnauthorized } from './session';

export const API_BASE_URL = import.meta.env.VITE_API_URL;
const DEFAULT_TIMEOUT_MS = 90000  // 90 seconds;

export const apiFetch = async (endpoint, options = {}, isAuthCall = false) => {
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), DEFAULT_TIMEOUT_MS);
  
  const sessionSignal = getSessionSignal();
  const combinedSignal = options.signal ?? anySignal([sessionSignal, timeoutController.signal]);

  try {
  
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      signal: options.signal ?? getSessionSignal(),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (res.status === 401) {
      if (isAuthCall) {
        throw new Error('Credenciales incorrectas');
      }
      handleUnauthorized();
      return;
    }

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message ?? 'Error en la petición');
    }

    if (res.status === 204) return null;

    return res.json();
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('La petición tardó demasiado. Intenta de nuevo.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
};

function anySignal(signals) {
  const controller = new AbortController();
  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort();
      break;
    }
    signal.addEventListener('abort', () => controller.abort(), { once: true });
  }
  return controller.signal;
}