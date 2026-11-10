import { useState } from "react";
import { Button, Popover, TextField } from "@mui/material";

import styles from "../Enrollment.module.css";
import ui from "../../../../shared/components/Ui/Ui.module.css";
import * as service from "../services/EnrollmentService";

const ResponsePopover = ({ target, onClose, onSaved }) => {
  const { anchor, row, confirm } = target;
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async () => {
    setBusy(true);
    setError(null);

    try {
      await service.respondPreEnrollment(row.preEnrollmentId, confirm, note.trim() === "" ? null : note.trim());
      onSaved(
        confirm
          ? `Cupo confirmado para ${row.studentName}.`
          : `${row.studentName} no continúa. Secretaría recibió el aviso para el SIMAT.`,
      );
    } catch (err) {
      setError(err.message ?? "No fue posible registrar la respuesta.");
      setBusy(false);
    }
  };

  return (
    <Popover
      open
      anchorEl={anchor}
      onClose={busy ? undefined : onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <div className={styles.popover}>
        <p className={styles.popoverTitle}>{confirm ? "¿La familia confirmó el cupo?" : "¿La familia no continúa?"}</p>

        <p className={styles.hint}>
          {confirm
            ? `${row.studentName} queda con cupo en ${row.gradeName}.`
            : "Se libera el cupo y Secretaría recibe una alerta para registrarlo en el SIMAT."}
        </p>

        <TextField
          size="small"
          fullWidth
          placeholder="Nota (opcional)"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          disabled={busy}
          slotProps={{ htmlInput: { maxLength: 300, "aria-label": "Nota" } }}
        />

        {error && <p className={styles.error}>{error}</p>}

        <div className={ui.panelActions}>
          <Button onClick={onClose} disabled={busy}>
            Cancelar
          </Button>
          <Button variant="contained" color={confirm ? "primary" : "error"} onClick={submit} disabled={busy}>
            {busy ? "Guardando…" : confirm ? "Sí, confirmó" : "Sí, no continúa"}
          </Button>
        </div>
      </div>
    </Popover>
  );
};

export default ResponsePopover;
