import { useCallback, useState } from "react";

export function useToast() {
  const [toast, setToast] = useState(null);

  const notify = useCallback((message, kind = "info") => setToast({ id: Date.now(), message, kind }), []);
  const close = useCallback(() => setToast(null), []);

  return { toast, notify, close };
}
