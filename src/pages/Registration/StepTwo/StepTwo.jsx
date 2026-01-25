import React from "react";
import { useFormContext } from "react-hook-form";
import AppButton from "ui/AppButton";
import AppTextField from "ui/AppTextField";
import styles from "../RegistrationPage.module.scss";

const StepTwo = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={styles.form}>
      <div className={styles.fields}>
        <AppTextField
          label="Фамилия"
          {...register("lastName", { required: "Введите фамилию" })}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
        />

        <AppTextField
          label="Имя"
          {...register("firstName", { required: "Введите имя" })}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
        />

        <AppTextField
          label="Отчество"
          {...register("middleName")}
          error={!!errors.middleName}
          helperText={errors.middleName?.message}
        />
      </div>

      <AppButton type="submit">
        Зарегистрироваться
      </AppButton>
    </div>
  );
};

export default StepTwo;
