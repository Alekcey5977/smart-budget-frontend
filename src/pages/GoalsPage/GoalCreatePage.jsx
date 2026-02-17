import { Alert, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCreateGoalMutation } from "services/goals/goalsApi";
import AppButton from "ui/AppButton";
import AppTextField from "ui/AppTextField";
import styles from "./GoalCreatePage.module.scss";

export default function GoalCreatePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [errorText, setErrorText] = useState("");
  const [createGoal, { isLoading }] = useCreateGoalMutation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorText("");

    if (!title.trim() || !deadline || !totalAmount) {
      setErrorText("Заполните все поля");
      return;
    }

    try {
      await createGoal({
        title: title.trim(),
        deadline: `${deadline}T00:00:00`,
        total_amount: Number(totalAmount),
      }).unwrap();
      navigate("/goals");
    } catch (error) {
      const message = error?.data?.detail;
      if (typeof message === "string") {
        setErrorText(message);
      } else {
        setErrorText("Не удалось создать цель");
      }
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {errorText && <Alert severity="error">{errorText}</Alert>}

      <div className={styles.field}>
        <Typography variant="body1">Название Цели:</Typography>
        <AppTextField
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className={styles.field}>
        <Typography variant="body1">Дедлайн:</Typography>
        <AppTextField
          type="date"
          value={deadline}
          onChange={(event) => setDeadline(event.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className={styles.field}>
        <Typography variant="body1">Итоговая сумма цели:</Typography>
        <AppTextField
          type="number"
          value={totalAmount}
          onChange={(event) => setTotalAmount(event.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className={styles.actions}>
        <AppButton type="submit" disabled={isLoading}>
          {isLoading ? "Создание..." : "Создать цель"}
        </AppButton>
      </div>
    </form>
  );
}
