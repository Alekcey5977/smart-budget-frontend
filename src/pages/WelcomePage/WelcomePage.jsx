import { Button, Typography, Box, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import UnauthLayout from "../../layout/UnauthLayout";
import styles from "./WelcomePage.module.scss";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <UnauthLayout>
      <Box className={styles.page}>
        <Box className={styles.header}>
          <Typography variant="h1" component="h1" align="right">
            Умный
            <br />
            бюджет
          </Typography>

          <Typography
            variant="subtitle1"
            component="p"
            align="right"
            color="text.secondary"
          >
            Учёт расходов стал проще
          </Typography>
        </Box>

        <Box className={styles.spacer} />

        <Stack className={styles.buttonsBlock} spacing={2.25}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{ letterSpacing: "0.26em" }}
            onClick={() => navigate("/login")}
          >
            Авторизация
          </Button>

          <Button
            variant="outlined"
            color="primary"
            size="large"
            fullWidth
            sx={{ letterSpacing: "0.26em" }}
            onClick={() => console.log("Регистрация")}
          >
            Регистрация
          </Button>
        </Stack>
      </Box>
    </UnauthLayout>
  );
}
