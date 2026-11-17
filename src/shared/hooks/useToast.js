import { useCallback, useState } from "react";

// Aviso breve al pie de la pantalla. `kind`: "info", "success", "warning" o "error".
// `options`: { title, details: [], persistent }. Con `persistent` no se cierra solo:
// se usa cuando el usuario debe leer o copiar algo, como una contraseña temporal.
export function useToast() {
  const [toast, setToast] = useState(null);

  const notify = useCallback(
    (message, kind = "info", options = {}) => setToast({ id: Date.now(), message, kind, ...options }),
    [],
  );
  const close = useCallback(() => setToast(null), []);

  return { toast, notify, close };
}
