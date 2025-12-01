import { Box } from "@mui/material";

const UnauthLayout = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      {children}
    </Box>
  );
};

export default UnauthLayout;
