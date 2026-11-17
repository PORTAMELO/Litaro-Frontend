import { useCallback, useEffect, useEffectEvent, useState } from "react";

const FALLBACK_ERROR = "No fue posible cargar la información.";

export function useLoad(load, deps = [], enabled = true) {
  const [state, setState] = useState({ key: null, data: null, error: null });
  const [version, setVersion] = useState(0);

  const key = enabled ? JSON.stringify([...deps, version]) : null;
  const run = useEffectEvent(load);

  useEffect(() => {
    if (key === null) return undefined;

    let cancelled = false;

    run()
      .then((data) => {
        if (!cancelled) setState({ key, data, error: null });
      })
      .catch((error) => {
        if (!cancelled) setState({ key, data: null, error: error?.message ?? FALLBACK_ERROR });
      });

    return () => {
      cancelled = true;
    };
  }, [key]);

  const reload = useCallback(() => setVersion((current) => current + 1), []);
  const settled = state.key === key;

  return {
    data: enabled ? state.data : null,
    error: settled ? state.error : null,
    loading: enabled && !settled,
    reload,
  };
}
