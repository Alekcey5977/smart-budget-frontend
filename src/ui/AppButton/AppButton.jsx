import { Button } from "@mui/material";

export default function AppButton({
  variant = "contained",
  children,
  sx = {},
  ...props
}) {
  return (
    <Button 
      variant={variant} 
      color="primary" 
      fullWidth 
      sx={{
        height: 52,
        borderRadius: "18px",
        fontSize: 18,
        fontWeight: 800,
        letterSpacing: 0,
        textTransform: "none",
        ...sx
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
