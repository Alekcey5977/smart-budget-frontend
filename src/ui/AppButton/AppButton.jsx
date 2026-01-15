import { Button } from "@mui/material";

export default function AppButton({
  variant = "contained",
  children,
  ...props
}) {
  return (
    <Button variant={variant} color="primary" fullWidth {...props}>
      {children}
    </Button>
  );
}
