import { createTheme } from "@mui/material/styles";

export const enrollmentTheme = createTheme({
  palette: {
    primary: { main: "#16113a" },
    error: { main: "#b91c1c" },
    warning: { main: "#d97706" },
    success: { main: "#0f9d58" },
    info: { main: "#2563eb" },
    text: { primary: "#111827", secondary: "#6b7280" },
    divider: "rgba(0, 0, 0, 0.08)",
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: "inherit",
    body1: { fontSize: "0.8rem" },
    body2: { fontSize: "0.7rem" },
    button: { fontSize: "0.8rem", fontWeight: 600, textTransform: "none" },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { padding: "6px 14px", lineHeight: 1.3 } },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { backgroundColor: "#ffffff", fontSize: "0.8rem" },
        input: { padding: "8px 12px" },
      },
    },
    MuiTab: {
      defaultProps: { disableRipple: true },
      styleOverrides: { root: { minHeight: 44, padding: "8px 16px", fontSize: "0.8rem" } },
    },
    MuiMenuItem: {
      styleOverrides: { root: { fontSize: "0.8rem" } },
    },
    MuiPopover: {
      styleOverrides: { paper: { borderRadius: 12, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)" } },
    },
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: 16 } },
    },
  },
});
