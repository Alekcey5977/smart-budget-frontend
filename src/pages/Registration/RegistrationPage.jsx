import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import UnauthLayout from "@layout/UnauthLayout";
import StepOne from "./StepOne/StepOne";
import StepTwo from "./StepTwo/StepTwo";
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
    <UnauthLayout showBack title="Регистрация" onBack={goBack}>
      <FormProvider {...methods}>
        <form
          className={styles.form}
          onSubmit={methods.handleSubmit(handleRegister)}
        >
          {step === 1 ? <StepOne onContinue={goNext} /> : <StepTwo />}
        </form>
      </FormProvider>
    </UnauthLayout>
  );
};

export default RegistrationPage;
