import React, { useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import { useRegisterMutation } from "src/services/auth/authApi";
import UnauthLayout from "layout/UnauthLayout/UnauthLayout";
import StepOne from "./StepOne/StepOne";
import StepTwo from "./StepTwo/StepTwo";
import { translateError } from "src/utils/errorHelpers";
import styles from "./RegistrationPage.module.scss";

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [registerRequest, { error: regError }] = useRegisterMutation();

  const methods = useForm({ mode: "onBlur" });

  const goBack = useCallback(() => {
    if (step === 1) {
      navigate("/");
      return;
    }
    setStep(1);
  }, [navigate, step]);

  const goNext = useCallback(() => setStep(2), []);

  const handleRegister = useCallback(
    async (values) => {
      try {
        await registerRequest(values).unwrap();
        navigate("/login", {
          state: {
            message:
              "Регистрация прошла успешно! Теперь можете войти в приложение",
          },
        });
      } catch (err) {
        // Ошибка обрабатывается через regError
      }
    },
    [registerRequest, navigate],
  );

  const errorMessage = translateError(regError?.data);

  return (
    <UnauthLayout showBack title="Регистрация" onBack={goBack}>
      <FormProvider {...methods}>
        <form
          className={styles.form}
          onSubmit={methods.handleSubmit(handleRegister)}
        >
          {regError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          {step === 1 ? <StepOne onContinue={goNext} /> : <StepTwo />}
        </form>
      </FormProvider>
    </UnauthLayout>
  );
};

export default RegistrationPage;
