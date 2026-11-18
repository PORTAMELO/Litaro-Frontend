import {
  getSessionSignal,
  handleUnauthorized,
} from "./Session";

export const API_BASE_URL = import.meta.env.VITE_API_URL;

const DEFAULT_TIMEOUT_MS = 90000; // 90 segundos

const TIMEOUT_MESSAGE = "La petición tardó demasiado. Intenta de nuevo.";
const SESSION_MESSAGE = "Tu sesión venció. Inicia sesión de nuevo.";

const sessionExpired = (cause) => {
  const error = new Error(SESSION_MESSAGE, { cause });
  error.status = 401;

  return error;
};

export const apiFetch = async (
  endpoint,
  requestOptions = {},
  isAuthCall = false,
) => {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, raw = false, signal: callerSignal, ...options } = requestOptions;

  const timeoutController = new AbortController();
  let timedOut = false;

  const timeoutId = setTimeout(() => {
    timedOut = true;
    timeoutController.abort();
  }, timeoutMs);

  const sessionSignal = getSessionSignal();

  // El límite de tiempo y el cierre de sesión aplican siempre,
  // también cuando quien llama pasa su propia señal de cancelación.
  const combinedSignal = anySignal(
    [sessionSignal, timeoutController.signal, callerSignal].filter(Boolean),
  );

  const isFormData = options.body instanceof FormData;

  try {
    const response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        credentials: "include",
        signal: combinedSignal,
        cache: "no-store",
        headers: {
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
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

      throw sessionExpired();
    }

    // Cualquier otro error HTTP
    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({}));

      const httpError = new Error(
        (typeof error === "string" ? error : error?.message) ?? "Error en la petición",
      );
      httpError.status = response.status;

      throw httpError;
    }

    // Sin contenido
    if (response.status === 204) {
      return null;
    }

    return raw ? response.blob() : response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      if (timedOut) {
        throw new Error(TIMEOUT_MESSAGE, { cause: error });
      }

      if (sessionSignal.aborted) {
        throw sessionExpired(error);
      }
    }

    // Una cancelación pedida por quien llama se propaga tal cual (AbortError).
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
