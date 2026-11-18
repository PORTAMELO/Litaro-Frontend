import { useCallback, useState } from "react";

const CLOSED = { open: false, title: "", message: "", confirmText: undefined, action: null };

// Pide confirmación antes de una acción. `ask({ title, message, confirmText, action })`
// abre el diálogo; `dialogProps` se pasa tal cual a <ConfirmDialog />.
export function useConfirm() {
  const [state, setState] = useState(CLOSED);

  const ask = useCallback((options) => setState({ ...CLOSED, ...options, open: true }), []);
  const close = useCallback(() => setState((previous) => ({ ...previous, open: false })), []);

  const onConfirm = async () => {
    try {
      await state.action?.();
    } finally {
      close();
    }
  };

  const dialogProps = {
    open: state.open,
    title: state.title,
    message: state.message,
    confirmText: state.confirmText,
    onClose: close,
    onConfirm,
  };

  return { ask, dialogProps };
}
