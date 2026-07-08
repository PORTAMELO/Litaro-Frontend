import {
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
} from "@mui/material";

const AppNotification = ({ open, severity, title, message, onClose }) => {
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
    <Snackbar open={open} autoHideDuration={2500} onClose={onClose}>
      <Alert severity={severity} onClose={onClose} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AppNotification;
