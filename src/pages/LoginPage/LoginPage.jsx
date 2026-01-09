import { useNavigate } from "react-router-dom";
import { Button, TextField, Typography } from "@mui/material";
import UnauthLayout from "../../layout/UnauthLayout";
import styles from "./LoginPage.module.scss";

export default function LoginPage() {
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    navigate("/home");
  };

  const goRegister = () => navigate("/register");

  const onLinkKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goRegister();
    }
  };

  return (
    <UnauthLayout
      showBack
      title="Авторизация"
    >
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.fields}>
          <TextField
            className={styles.input}
            placeholder="Введите вашу почту"
            fullWidth
            variant="outlined"
          />

          <TextField
            className={styles.input}
            placeholder="Введите ваш пароль"
            fullWidth
            type="password"
            variant="outlined"
          />
        </div>

        <Typography variant="body2" className={styles.helperText}>
          У вас нет аккаунта?{" "}
          <span
            className={styles.link}
            onClick={goRegister}
            onKeyDown={onLinkKeyDown}
            role="button"
            tabIndex={0}
          >
            Зарегистрируйтесь
          </span>
        </Typography>

        <Button type="submit" variant="contained" fullWidth className={styles.primaryButton}>
          Войти
        </Button>
      </form>
    </UnauthLayout>
  );
}
