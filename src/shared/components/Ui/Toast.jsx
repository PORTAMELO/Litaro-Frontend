import { IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import styles from "./Page.module.css";

const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  return (
    <Snackbar
      key={toast.id}
      open
      autoHideDuration={toast.kind === "error" ? 6000 : 3500}
      disableWindowBlurListener
      onClose={(_, reason) => {
        if (reason !== "clickaway") onClose();
      }}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <div className={`${styles.toast} ${toast.kind === "error" ? styles.toastError : ""}`} role="status">
        <span>{toast.message}</span>
        <IconButton size="small" aria-label="Cerrar" onClick={onClose} sx={{ color: "inherit", marginLeft: "auto" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
    </Snackbar>
  );
};

export default Toast;
