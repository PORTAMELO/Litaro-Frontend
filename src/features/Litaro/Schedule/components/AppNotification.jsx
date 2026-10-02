import { Alert, AlertTitle, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar } from "@mui/material";

const AppNotification = ({ open, severity, title, message, details = [], onClose }) => {
  if (severity === "error") {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>

        <DialogContent>{message}</DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Aceptar</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={severity === "warning" ? 8000 : 2500}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert severity={severity} onClose={onClose} variant="filled" sx={{ maxWidth: 480 }}>
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
        {details.length > 0 && (
          <ul style={{ margin: "4px 0 0", paddingLeft: "1.1rem" }}>
            {details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        )}
      </Alert>
    </Snackbar>
  );
};

export default AppNotification;
