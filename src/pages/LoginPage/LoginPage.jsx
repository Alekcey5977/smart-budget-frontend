import { useForm } from "react-hook-form";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../store/auth/authSlice";
import UnauthLayout from "../../layout/UnauthLayout";
import styles from "./LoginPage.module.scss";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    dispatch(
      login({
        user: { email: data.email },
        token: "fake-token-123",
      })
    );
    navigate("/");
  };

  return (
    <UnauthLayout>
      <Paper className={styles.card}>
        <Box className={styles.topBar}>
          <IconButton
            size="small"
            className={styles.backButton}
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        </Box>

        <Typography className={styles.title}>Авторизация</Typography>

        <Box className={styles.bottomBlock}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <TextField
              fullWidth
              placeholder="Введите вашу почту"
              {...register("email", { required: "Email обязателен" })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              fullWidth
              type="password"
              placeholder="Введите ваш пароль"
              {...register("password", { required: "Пароль обязателен" })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Typography className={styles.helperText}>
              У вас нет аккаунта?{" "}
              <span
                className={styles.link}
                onClick={() => navigate("/register")}
              >
                Зарегистрируйтесь
              </span>
            </Typography>

            <div className={styles.buttonWrapper}>
              <Button fullWidth type="submit">
                Войти
              </Button>
            </div>
          </form>
        </Box>
      </Paper>
    </UnauthLayout>
  );
};

export default LoginPage;
