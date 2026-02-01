import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Alert } from "@mui/material";
import { useForm } from "react-hook-form";
import { loginUser, clearError } from "store/auth/authSlice";
import UnauthLayout from "layout/UnauthLayout/UnauthLayout";
import AppButton from "ui/AppButton/AppButton";
import AppTextField from "ui/AppTextField/AppTextField";
import styles from "./LoginPage.module.scss";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Достаем статус и ошибку из стора
  const { status, error } = useSelector((state) => state.auth);
  const isLoading = status === "loading";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  // Очищаем ошибку при входе на страницу
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = (data) => {
    dispatch(loginUser({ email: data.email, password: data.password }))
      .unwrap() // Позволяет обработать успех/неудачу прямо тут
      .then(() => {
        navigate("/home");
      })
      .catch((err) => {
        console.error("Login failed:", err);
      });
  };

  return (
    <UnauthLayout showBack title="Авторизация">
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <div className={styles.fields}>
          <AppTextField
            label="Email"
            placeholder="Введите вашу почту"
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={isLoading}
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
            disabled={isLoading}
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

        <AppButton type="submit" disabled={isLoading}>
          {isLoading ? "Вход..." : "Войти"}
        </AppButton>
      </form>
    </UnauthLayout>
  );
}
