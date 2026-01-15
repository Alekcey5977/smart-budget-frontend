import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";

import UnauthLayout from "@layout/UnauthLayout";
import AppButton from "@ui/AppButton";
import AppTextField from "@ui/AppTextField";

import styles from "./LoginPage.module.scss";

export default function LoginPage() {
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <UnauthLayout showBack title="Авторизация">
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.fields}>
          <AppTextField placeholder="Введите вашу почту" />
          <AppTextField placeholder="Введите ваш пароль" type="password" />
        </div>

        <Typography variant="body2" className={styles.helperText}>
          У вас нет аккаунта?{" "}
          <span
            className={styles.link}
            onClick={() => navigate("/register")}
            role="button"
            tabIndex={0}
          >
            Зарегистрируйтесь
          </span>
        </Typography>

        <AppButton type="submit">Войти</AppButton>
      </form>
    </UnauthLayout>
  );
}
