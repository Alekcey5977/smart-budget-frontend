import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import UnauthLayout from "../../layout/UnauthLayout";
import styles from "./WelcomePage.module.scss";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <UnauthLayout
      title="Умный бюджет"
      subtitle="Учёт расходов стал проще"
    >
      <div className={styles.buttonsBlock}>
        <Button
          variant="contained"
          fullWidth
          className={styles.primaryButton}
          onClick={() => navigate("/login")}
        >
          Авторизация
        </Button>

        <Button
          variant="outlined"
          fullWidth
          className={styles.secondaryButton}
          onClick={() => console.log("Нажата кнопка Регистрация")}
        >
          Регистрация
        </Button>
      </div>
    </UnauthLayout>
  );
}
