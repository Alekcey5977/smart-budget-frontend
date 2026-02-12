import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import AppButton from "ui/AppButton";
import styles from "./GoalsPage.module.scss";

export default function GoalsPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.root}>
      <div className={styles.empty}>
        <Typography variant="body2" color="text.secondary">
          Целей нет
        </Typography>
      </div>

      <div className={styles.actions}>
        <AppButton onClick={() => navigate("/goals/create")}>
          Создать цель
        </AppButton>
      </div>
    </div>
  );
}
