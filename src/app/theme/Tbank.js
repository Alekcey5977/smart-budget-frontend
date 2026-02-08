import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    background: {
      default: "#181818",
      paper: "#f4f0e6",
    },
    primary: {
      main: "#ffe56b",
      contrastText: "#141414",
    },
    text: {
      primary: "#141414",
      secondary: "#4a4a4a",
    },
  },

  typography: {
    fontFamily:
      '"Manrope", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',

    h1: {
      fontWeight: 800,
      fontSize: "42px",
      lineHeight: 1.15,
    },

    subtitle1: {
      fontSize: "20px",
      lineHeight: 1.35,
      fontWeight: 400,
    },

    body2: {
      fontSize: "12px",
      lineHeight: 1.4,
    },

    button: {
      fontSize: "22px",
      letterSpacing: "0.26em",
      textTransform: "none",
      fontWeight: 400,
    },
  },

  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          height: 78,
          borderRadius: 20,
          boxShadow: "none",
          color: theme.palette.text.primary,
        }),
        containedPrimary: {
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
        outlinedPrimary: {
          borderWidth: 2,
          "&:hover": { borderWidth: 2 },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 16,
          backgroundColor: "transcrept",

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
            borderWidth: 2,
          },

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
          },
        }),

        input: {
          padding: "14px 16px",
        },
      },
    },
  },
  shape: {
    avatar: 88,
  },
});
