import React from "react";
import {
  Button,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import styles from "./RegistrationPage.module.scss";

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
        fullWidth
        className={styles.submitButton}
        onClick={handleContinue}
      >
        Продолжить
      </Button>
    </div>
  );
};

const StepTwo = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext();

  return (
    <form className={styles.formArea} onSubmit={handleSubmit(onSubmit)}>
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
    </form>
  );
};

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const step = searchParams.get("step") === "2" ? 2 : 1;

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

    setSearchParams({ step: "1" });
  };

  const goNext = () => setSearchParams({ step: "2" });

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
                <StepTwo onSubmit={handleRegister} />
              )}
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
