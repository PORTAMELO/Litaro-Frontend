import { createTheme } from "@mui/material/styles";

import { breakpoints, colors, fontFamily, fontWeight, leading, radius, shadow, text } from "./tokens";

// Tema de MUI construido desde tokens.js. Se aplica una sola vez, en main.jsx.
export const litaroTheme = createTheme({
  breakpoints: {
    values: { xs: 0, sm: breakpoints.mobile, md: breakpoints.tablet, lg: breakpoints.desktop, xl: 1536 },
  },
  palette: {
    primary: { main: colors.primary, dark: colors.primaryHover, contrastText: colors.onPrimary },
    error: { main: colors.error },
    warning: { main: colors.warning, dark: colors.warningText },
    success: { main: colors.success, dark: colors.successText },
    info: { main: colors.info },
    text: { primary: colors.text, secondary: colors.textMuted, disabled: colors.textDisabled },
    divider: colors.border,
    background: { default: colors.background, paper: colors.surface },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily,
    h4: { fontSize: text.headline, fontWeight: fontWeight.bold, lineHeight: leading.headline },
    h5: { fontSize: text.headline, fontWeight: fontWeight.bold, lineHeight: leading.headline },
    h6: { fontSize: text.title, fontWeight: fontWeight.bold, lineHeight: leading.title },
    subtitle1: { fontSize: text.subtitle, fontWeight: fontWeight.bold, lineHeight: leading.subtitle },
    subtitle2: { fontSize: text.label, fontWeight: fontWeight.semibold, lineHeight: leading.label },
    body1: { fontSize: text.body, lineHeight: leading.body },
    body2: { fontSize: text.label, lineHeight: leading.label },
    caption: { fontSize: text.caption, lineHeight: leading.caption },
    button: { fontSize: text.label, fontWeight: fontWeight.semibold, textTransform: "none" },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { padding: "6px 16px", lineHeight: leading.label } },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { backgroundColor: colors.surface, fontSize: text.body },
        input: { padding: "8px 12px" },
      },
    },
    MuiInputLabel: {
      styleOverrides: { root: { fontSize: text.body } },
    },
    MuiTab: {
      defaultProps: { disableRipple: true },
      styleOverrides: { root: { minHeight: 44, padding: "8px 16px", fontSize: text.label } },
    },
    MuiMenuItem: {
      styleOverrides: { root: { fontSize: text.body } },
    },
    MuiPopover: {
      styleOverrides: { paper: { borderRadius: radius.md, boxShadow: shadow.md } },
    },
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: radius.lg, boxShadow: shadow.lg } },
    },
  },
});
