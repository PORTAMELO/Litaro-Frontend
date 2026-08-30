import {
  getSessionSignal,
  handleUnauthorized,
} from "./session";

export const API_BASE_URL = import.meta.env.VITE_API_URL;

const DEFAULT_TIMEOUT_MS = 90000; // 90 segundos

export const apiFetch = async (
  endpoint,
  options = {},
  isAuthCall = false,
) => {
  const timeoutController = new AbortController();

  const timeoutId = setTimeout(() => {
    timeoutController.abort();
  }, DEFAULT_TIMEOUT_MS);

  const sessionSignal = getSessionSignal();

  const combinedSignal =
    options.signal ??
    anySignal([
      sessionSignal,
      timeoutController.signal,
    ]);

  try {
    const response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        credentials: "include",
        signal: combinedSignal,
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      },
    );

    // Sesión no válida
    if (response.status === 401) {
      if (isAuthCall) {
        throw new Error("Credenciales incorrectas");
      }

      handleUnauthorized();

      return;
    }

    // Cualquier otro error HTTP
    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({}));

      throw new Error(
        error.message ?? "Error en la petición",
      );
    }

    // Sin contenido
    if (response.status === 204) {
      return null;
    }

    return response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        "La petición tardó demasiado. Intenta de nuevo.", {cause: error},
      );
    }

    throw error;
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

    signal.addEventListener(
      "abort",
      () => controller.abort(),
      { once: true },
    );
  }

  return controller.signal;
}