import { createTheme } from "@mui/material/styles";

const COLORS = {
  bg: "#181818",
  surface: "#f4f0e6",
  accent: "#ffe56b",
  text: "#141414",
  muted: "#4a4a4a",
};

export const theme = createTheme({
  palette: {
    primary: { main: COLORS.accent },
    background: {
      default: COLORS.bg,
      paper: COLORS.surface,
    },
    text: {
      primary: COLORS.text,
      secondary: COLORS.muted,
    },
  },
  typography: {
    fontFamily:
      '"Manrope", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
    h1: { fontWeight: 800, fontSize: 42, lineHeight: 1.15 },
    h2: { fontWeight: 800, fontSize: 42, lineHeight: 1.15 },
    subtitle1: { fontWeight: 400, fontSize: 20, lineHeight: 1.35 },
    body2: { fontSize: 12 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: "none",
          boxShadow: "none",
        },
        sizeLarge: {
          height: 78,
          fontSize: 22,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: COLORS.accent,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: COLORS.accent,
          },
        },
        notchedOutline: {
          borderWidth: 2,
          borderColor: COLORS.accent,
        },
      },
    },
  },
});
