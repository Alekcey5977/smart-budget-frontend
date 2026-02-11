import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "src/services/auth/authApi";
import UnauthLayout from "layout/UnauthLayout/UnauthLayout";
import AppButton from "ui/AppButton/AppButton";
import AppTextField from "ui/AppTextField/AppTextField";
import styles from "./LoginPage.module.scss";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loginRequest, { isLoading, error: apiError }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
    try {
      await loginRequest({
        email: data.email,
        password: data.password,
      }).unwrap();
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
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={isLoading}
            {...register("email", { required: "Почта обязательна" })}
          />
          <AppTextField
            label="Пароль"
            type="password"
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={isLoading}
            {...register("password", { required: "Пароль обязателен" })}
          />
        </div>
        <AppButton type="submit" disabled={isLoading}>
          {isLoading ? "Вход..." : "Войти"}
        </AppButton>
      </form>
    </UnauthLayout>
  );
}
