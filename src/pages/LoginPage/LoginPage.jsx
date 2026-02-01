import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Typography } from "@mui/material";

import { login } from "store/auth/authSlice";
import UnauthLayout from "layout/UnauthLayout/UnauthLayout";
import AppButton from "ui/AppButton/AppButton";
import AppTextField from "ui/AppTextField/AppTextField";
import styles from "./LoginPage.module.scss";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login());
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
