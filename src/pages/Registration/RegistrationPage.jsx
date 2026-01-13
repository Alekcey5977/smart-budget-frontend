import React, { useState } from "react";
import { IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import StepOne from "./components/StepOne";
import StepTwo from "./components/StepTwo";
import styles from "./RegistrationPage.module.scss";

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const methods = useForm({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      lastName: "",
      firstName: "",
      middleName: "",
    },
  });

  const goBack = () => {
    if (step === 1) {
      navigate("/");
      return;
    }

    setStep(1);
  };

  const goNext = () => setStep(2);

  const handleRegister = (values) => {
    console.log("Регистрация", values);
    // TODO: вызвать API и сохранить пользователя в store
  };

  return (
    <div className={styles.root}>
      <div className={styles.phone}>
        <div className={styles.topBar}>
          <IconButton
            onClick={goBack}
            className={styles.backButton}
            aria-label="Назад"
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
        </div>

        <div className={styles.content}>
          <div className={styles.header}>
            <Typography component="h1" className={styles.title}>
              Регистрация
            </Typography>
          </div>

          <div className={styles.spacer} />

          <div className={styles.formWrapper}>
            <FormProvider {...methods}>
              {step === 1 ? (
                <StepOne onContinue={goNext} />
              ) : (
                <form onSubmit={methods.handleSubmit(handleRegister)}>
                  <StepTwo />
                </form>
              )}
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
