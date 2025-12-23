import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.scss";

export default function LoginPage() {
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Авторизация</h1>

      <div className={styles.spacer} />

      <form className={styles.form} onSubmit={onSubmit}>
        <input className={styles.input} placeholder="Введите вашу почту" />
        <input
          className={styles.input}
          placeholder="Введите ваш пароль"
          type="password"
        />

        <p className={styles.helperText}>
          У вас нет аккаунта?{" "}
          <span className={styles.link} onClick={() => console.log("register")}>
            Зарегистрируйтесь
          </span>
        </p>

        <button className={styles.primaryButton} type="submit">
          Войти
        </button>
      </form>
    </div>
  );
}
