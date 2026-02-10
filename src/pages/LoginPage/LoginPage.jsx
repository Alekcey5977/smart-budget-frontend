import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Typography, Alert } from "@mui/material";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "services/auth/authApi";
import { login, clearError } from "store/auth/authSlice";
import UnauthLayout from "layout/UnauthLayout/UnauthLayout";
import AppButton from "ui/AppButton/AppButton";
import AppTextField from "ui/AppTextField/AppTextField";
import styles from "./LoginPage.module.scss";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginRequest, { isLoading, error: apiError }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
    try {
      const response = await loginRequest({
        email: data.email,
        password: data.password,
      }).unwrap();

      const token = response.access_token || response.token;
      dispatch(login({ token }));

      navigate("/home");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const errorMessage = apiError?.data?.detail || "Ошибка авторизации";

  return (
    <UnauthLayout showBack title="Авторизация">
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {typeof errorMessage === "string"
              ? errorMessage
              : JSON.stringify(errorMessage)}
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
