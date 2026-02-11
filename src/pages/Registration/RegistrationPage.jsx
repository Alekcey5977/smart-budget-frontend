import React, { useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import { useRegisterMutation } from "src/services/auth/authApi";
import UnauthLayout from "layout/UnauthLayout/UnauthLayout";
import StepOne from "./StepOne/StepOne";
import StepTwo from "./StepTwo/StepTwo";
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
        navigate("/login");
      } catch (err) {
        console.error("Registration failed", err);
      }
    },
    [registerRequest, navigate],
  );

  const errorMessage = regError?.data?.detail || "Ошибка регистрации";

  return (
    <UnauthLayout showBack title="Регистрация" onBack={goBack}>
      <FormProvider {...methods}>
        <form
          className={styles.form}
          onSubmit={methods.handleSubmit(handleRegister)}
        >
          {regError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {typeof errorMessage === "string"
                ? errorMessage
                : JSON.stringify(errorMessage)}
            </Alert>
          )}
          {step === 1 ? <StepOne onContinue={goNext} /> : <StepTwo />}
        </form>
      </FormProvider>
    </UnauthLayout>
  );
};

export default RegistrationPage;
