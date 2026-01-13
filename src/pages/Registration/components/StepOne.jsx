import React from "react";
import { Button, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useFormContext } from "react-hook-form";
import styles from "../RegistrationPage.module.scss";

const StepOne = ({ onContinue }) => {
  const {
    register,
    trigger,
    watch,
    formState: { errors },
  } = useFormContext();

  const password = watch("password");

  const handleContinue = async () => {
    const valid = await trigger(["email", "password", "confirmPassword"]);
    if (valid) {
      onContinue();
    }
  };

  return (
    <div className={styles.formArea}>
      <div className={styles.fields}>
        <TextField
          className={styles.textField}
          placeholder="Введите вашу почту"
          variant="outlined"
          fullWidth
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

        <TextField
          className={styles.textField}
          placeholder="Введите ваш пароль"
          type="password"
          variant="outlined"
          fullWidth
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

        <TextField
          className={styles.textField}
          placeholder="Введите пароль еще раз"
          type="password"
          variant="outlined"
          fullWidth
          {...register("confirmPassword", {
            required: "Повторите пароль",
            validate: (value) =>
              value === password || "Пароли не совпадают",
          })}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />

        <Typography component="p" className={styles.helperText}>
          У вас есть аккаунт?{" "}
          <Link to="/login" className={styles.link}>
            Войдите
          </Link>
        </Typography>
      </div>

      <Button
        type="button"
        fullWidth
        className={styles.submitButton}
        onClick={handleContinue}
      >
        Продолжить
      </Button>
    </div>
  );
};

export default StepOne;
