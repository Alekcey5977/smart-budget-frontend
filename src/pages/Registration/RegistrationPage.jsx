import React, { useCallback, useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Alert } from "@mui/material";

import {
  useRegisterMutation,
  useLoginMutation,
} from "src/services/auth/authApi";
import { login, clearError } from "store/auth/authSlice";

import UnauthLayout from "layout/UnauthLayout/UnauthLayout";
import StepOne from "./StepOne/StepOne";
import StepTwo from "./StepTwo/StepTwo";
import styles from "./RegistrationPage.module.scss";

const RegistrationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);

  const [registerRequest, { error: regError }] = useRegisterMutation();
  const [loginRequest] = useLoginMutation();

  const methods = useForm({
    mode: "onBlur",
    defaultValues: {},
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const goBack = useCallback(() => {}, [navigate, step]);
  const goNext = useCallback(() => setStep(2), []);

  const handleRegister = useCallback(
    async (values) => {
      try {
        await registerRequest(values).unwrap();

        const loginResponse = await loginRequest({
          email: values.email,
          password: values.password,
        }).unwrap();

        const token = loginResponse.access_token || loginResponse.token;
        dispatch(login({ token }));

        navigate("/home");
      } catch (err) {
        console.error("Registration failed", err);
      }
    },
    [registerRequest, loginRequest, dispatch, navigate],
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
