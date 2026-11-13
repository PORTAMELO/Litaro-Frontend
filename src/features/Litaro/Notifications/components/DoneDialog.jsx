import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

import { NOTE_LIMIT } from "../utils/NotificationUtils";

const DoneDialog = ({ count, saving, onCancel, onConfirm }) => {
  const [note, setNote] = useState("");

  return (
    <Dialog open onClose={saving ? undefined : onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{count === 1 ? "Marcar como realizada" : `Marcar ${count} como realizadas`}</DialogTitle>

      <DialogContent>
        <TextField
          label="Nota"
          multiline
          minRows={2}
          fullWidth
          value={note}
          onChange={(event) => setNote(event.target.value.slice(0, NOTE_LIMIT))}
          sx={{ marginTop: 1 }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel} disabled={saving}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={() => onConfirm(note.trim() || null)} disabled={saving}>
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DoneDialog;
