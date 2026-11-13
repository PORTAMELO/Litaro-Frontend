import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import styles from "../Grades.module.css";

export const ViewButton = ({ disabled, onClick }) => (
  <Tooltip title="Ver">
    <span>
      <IconButton size="small" disabled={disabled} onClick={onClick}>
        <VisibilityOutlinedIcon fontSize="small" />
      </IconButton>
    </span>
  </Tooltip>
);

export const UploadButton = ({ replace, disabled, onFile }) => (
  <Tooltip title={replace ? "Reemplazar" : "Cargar"}>
    <span>
      <IconButton size="small" component="label" disabled={disabled}>
        <UploadFileOutlinedIcon fontSize="small" />
        <input
          type="file"
          accept="application/pdf,.pdf"
          className={styles.hiddenInput}
          disabled={disabled}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            onFile(file);
          }}
        />
      </IconButton>
    </span>
  </Tooltip>
);

export const DeleteButton = ({ disabled, onConfirm }) => {
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <Tooltip title="Eliminar">
        <span>
          <IconButton size="small" disabled={disabled} onClick={() => setConfirming(true)}>
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      <Dialog open={confirming} onClose={() => setConfirming(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Eliminar plan de estudio</DialogTitle>
        <DialogContent>La asignatura quedará pendiente de entrega.</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirming(false)}>Cancelar</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setConfirming(false);
              onConfirm();
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
