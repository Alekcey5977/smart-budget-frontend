import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { login } from "store/auth/authSlice"; 
import UnauthLayout from "layout/UnauthLayout/UnauthLayout";
import AppButton from "ui/AppButton/AppButton";
import AppTextField from "ui/AppTextField/AppTextField";
import styles from "./LoginPage.module.scss";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const onSubmit = (data) => {
    console.log("Login form data:", data);
    dispatch(login({ token: "demo-token" }));
    navigate("/home");
  };

  return (
    <UnauthLayout showBack title="Авторизация">
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.fields}>
          <AppTextField
            label="Email"
            placeholder="Введите вашу почту"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register("email", {
              required: "Почта обязательна",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Некорректный email",
              },
            })}
          />
          <AppTextField
            label="Пароль"
            placeholder="Введите ваш пароль"
            type="password"
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register("password", {
              required: "Пароль обязателен",
              minLength: { value: 6, message: "Минимум 6 символов" },
            })}
          />
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
