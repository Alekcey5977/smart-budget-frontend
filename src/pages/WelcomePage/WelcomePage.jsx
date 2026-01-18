import { useNavigate } from "react-router-dom";
import UnauthLayout from "layout/UnauthLayout";
import AppButton from "ui/AppButton";
import styles from "./WelcomePage.module.scss";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <UnauthLayout title="Умный бюджет" subtitle="Учёт расходов стал проще">
      <div className={styles.actions}>
        <AppButton onClick={() => navigate("/login")}>Авторизация</AppButton>
        <AppButton variant="outlined" onClick={() => navigate("/register")}>
          Регистрация
        </AppButton>
      </div>
    </UnauthLayout>
  );
}
