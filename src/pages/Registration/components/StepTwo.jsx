import React from "react";
import { Button, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import styles from "../RegistrationPage.module.scss";

const StepTwo = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={styles.formArea}>
      <div className={styles.fields}>
        <TextField
          className={styles.textField}
          label="Фамилия"
          variant="outlined"
          fullWidth
          {...register("lastName", { required: "Введите фамилию" })}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
        />

        <TextField
          className={styles.textField}
          label="Имя"
          variant="outlined"
          fullWidth
          {...register("firstName", { required: "Введите имя" })}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
        />

        <TextField
          className={styles.textField}
          label="Отчество"
          variant="outlined"
          fullWidth
          {...register("middleName")}
          error={!!errors.middleName}
          helperText={errors.middleName?.message}
        />
      </div>

      <Button type="submit" fullWidth className={styles.submitButton}>
        Зарегистрироваться
      </Button>
    </div>
  );
};

export default StepTwo;
