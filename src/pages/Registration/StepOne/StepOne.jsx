import React, { useCallback } from "react";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useFormContext } from "react-hook-form";
import AppButton from "ui/AppButton";
import AppTextField from "ui/AppTextField";
import styles from "../RegistrationPage.module.scss";

const StepOne = ({ onContinue }) => {
  const {
    register,
    trigger,
    watch,
    formState: { errors },
  } = useFormContext();

  const password = watch("password");

  const handleContinue = useCallback(async () => {
    const valid = await trigger(["email", "password", "confirmPassword"]);
    if (valid) {
      onContinue();
    }
  }, [onContinue, trigger]);

  return (
    <div className={styles.form}>
      <div className={styles.fields}>
        <AppTextField
          placeholder="Введите вашу почту"
          {...register("email", {
            required: "Введите почту",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Некорректный email",
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <AppTextField
          placeholder="Введите ваш пароль"
          type="password"
          {...register("password", {
            required: "Введите пароль",
            minLength: {
              value: 6,
              message: "Минимум 6 символов",
            },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <AppTextField
          placeholder="Введите пароль еще раз"
          type="password"
          {...register("confirmPassword", {
            required: "Повторите пароль",
            validate: (value) =>
              value === password || "Пароли не совпадают",
          })}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />

        <Typography
          component="p"
          variant="body2"
          color="text.secondary"
          className={styles.helperText}
        >
          У вас есть аккаунт?{" "}
          <Link to="/login" className={styles.link}>
            Войдите
          </Link>
        </Typography>
      </div>

      <AppButton
        type="button"
        onClick={handleContinue}
      >
        Продолжить
      </AppButton>
    </div>
  );
};

export default StepOne;
