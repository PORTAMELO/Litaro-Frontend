import { Snackbar } from "@mui/material";

import styles from "./Page.module.css";

const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  return (
    <Snackbar
      key={toast.id}
      open
      autoHideDuration={toast.kind === "error" ? 8000 : 4000}
      onClose={(_, reason) => {
        if (reason !== "clickaway") onClose();
      }}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <div className={`${styles.toast} ${toast.kind === "error" ? styles.toastError : ""}`} role="status">
        {toast.message}
      </div>
    </Snackbar>
  );
};

export default Toast;
