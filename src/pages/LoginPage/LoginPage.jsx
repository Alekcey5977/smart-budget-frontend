import { useNavigate } from "react-router-dom";
import { Button, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";

import UnauthLayout from "../../layout/UnauthLayout";
import styles from "./LoginPage.module.scss";

export default function LoginPage() {
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = () => {
    navigate("/home");
  };

  return (
    <UnauthLayout showBack>
      <div className={styles.page}>
        <Typography variant="h4" className={styles.title}>
          Авторизация
        </Typography>

        <div className={styles.bottom}>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <TextField
              placeholder="Введите вашу почту"
              fullWidth
              {...register("email")}
            />

            <TextField
              placeholder="Введите ваш пароль"
              type="password"
              fullWidth
              {...register("password")}
            />

            <div className={styles.actions}>
              <Typography variant="body2" className={styles.helperText}>
                У вас нет аккаунта?{" "}
                <span
                  className={styles.link}
                  onClick={() => navigate("/register")}
                >
                  Зарегистрируйтесь
                </span>
              </Typography>

              <Button type="submit" variant="contained" fullWidth>
                Войти
              </Button>
            </div>
          </form>
        </div>
      </div>
    </UnauthLayout>
  );
}
