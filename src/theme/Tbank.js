import { createTheme } from "@mui/material/styles";

const Tbank = createTheme({
  palette: {
    background: {
      default: "#111111",
      paper: "#e9cc84ff",
    },
    primary: {
      main: "#1976d2",
    },
    text: {
      primary: "#121212",
    },
  },
  shape: {
    borderRadius: 15,
  },
  typography: {
    fontFamily: [
      "Manrope",
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "sans-serif",
    ].join(","),
  },
});

export default Tbank;
