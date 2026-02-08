import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import AppButton from "ui/AppButton";
import AppTextField from "ui/AppTextField";
import styles from "./GoalCreatePage.module.scss";

export default function GoalCreatePage() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/goals");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <Typography variant="body1">Название Цели:</Typography>
        <AppTextField />
      </div>

      <div className={styles.field}>
        <Typography variant="body1">Дедлайн:</Typography>
        <AppTextField type="date" />
      </div>

      <div className={styles.field}>
        <Typography variant="body1">Итоговая сумма цели:</Typography>
        <AppTextField type="number" />
      </div>

      <div className={styles.actions}>
        <AppButton type="submit">Создать цель</AppButton>
      </div>
    </form>
  );
}
