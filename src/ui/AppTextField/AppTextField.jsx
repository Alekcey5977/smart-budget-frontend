import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 16,
    "& fieldset": {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

export default function AppTextField(props) {
  return <StyledTextField fullWidth variant="outlined" {...props} />;
}
