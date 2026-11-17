import { IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import styles from "./Page.module.css";

const DURATION = { error: 6000, warning: 8000 };
const DEFAULT_DURATION = 3500;

const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  const { id, kind, title, message, details = [], persistent = false } = toast;

  return (
    <Snackbar
      key={id}
      open
      autoHideDuration={persistent ? null : (DURATION[kind] ?? DEFAULT_DURATION)}
      disableWindowBlurListener
      onClose={(_, reason) => {
        if (reason !== "clickaway") onClose();
      }}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <div className={`${styles.toast} ${kind === "error" ? styles.toastError : ""}`} role={kind === "error" ? "alert" : "status"}>
        <div className={styles.toastBody}>
          {title && <strong className={styles.toastTitle}>{title}</strong>}
          {message && <span>{message}</span>}
          {details.length > 0 && (
            <ul className={styles.toastDetails}>
              {details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          )}
        </div>
        <IconButton size="small" aria-label="Cerrar" onClick={onClose} sx={{ color: "inherit", marginLeft: "auto" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
    </Snackbar>
  );
};

export default Toast;
