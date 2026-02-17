import { Alert, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  useDeleteGoalMutation,
  useGetGoalsQuery,
  useUpdateGoalMutation,
} from "services/goals/goalsApi";
import AppButton from "ui/AppButton";
import AppTextField from "ui/AppTextField";
import styles from "./GoalDetailsPage.module.scss";

const moneyFormatter = new Intl.NumberFormat("ru-RU");

function formatMoney(value) {
  return moneyFormatter.format(Number(value || 0));
}

function getInputDate(value) {
  if (!value) {
    return "";
  }
  return String(value).slice(0, 10);
}

export default function GoalDetailsPage() {
  const { goalId } = useParams();
  const navigate = useNavigate();
  const { data: goals = [], isLoading, isError } = useGetGoalsQuery();
  const [updateGoal, { isLoading: isUpdating }] = useUpdateGoalMutation();
  const [deleteGoal, { isLoading: isDeleting }] = useDeleteGoalMutation();

  const [errorText, setErrorText] = useState("");

  const goal = goals.find((item) => item.id === goalId);

  const leftAmount =
    Number(goal?.total_amount || 0) - Number(goal?.amount || 0);

  const handleSave = async (event) => {
    event.preventDefault();
    setErrorText("");

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") || "").trim();
    const deadline = String(formData.get("deadline") || "");
    const amount = Number(formData.get("amount") || 0);
    const totalAmount = Number(formData.get("totalAmount") || 0);

    if (!title.trim() || !deadline || !totalAmount) {
      setErrorText("Заполните обязательные поля");
      return;
    }

    try {
      await updateGoal({
        goalId,
        data: {
          title: title.trim(),
          deadline: `${deadline}T00:00:00`,
          amount: Number(amount || 0),
          total_amount: Number(totalAmount),
        },
      }).unwrap();
      navigate("/goals");
    } catch (error) {
      const message = error?.data?.detail;
      if (typeof message === "string") {
        setErrorText(message);
      } else {
        setErrorText("Не удалось сохранить цель");
      }
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm("Удалить цель?");
    if (!ok) {
      return;
    }

    setErrorText("");

    try {
      await deleteGoal(goalId).unwrap();
      navigate("/goals");
    } catch (error) {
      const message = error?.data?.detail;
      if (typeof message === "string") {
        setErrorText(message);
      } else {
        setErrorText("Не удалось удалить цель");
      }
    }
  };

  if (isLoading) {
    return (
      <div className={styles.center}>
        <Typography variant="body2" color="text.secondary">
          Загрузка...
        </Typography>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.center}>
        <Typography variant="body2" color="text.secondary">
          Не удалось загрузить цель
        </Typography>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className={styles.center}>
        <Typography variant="body2" color="text.secondary">
          Цель не найдена
        </Typography>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSave}>
      {errorText && <Alert severity="error">{errorText}</Alert>}

      <div className={styles.field}>
        <Typography variant="body1">Название цели:</Typography>
        <AppTextField
          name="title"
          defaultValue={goal.title}
          disabled={isUpdating || isDeleting}
        />
      </div>

      <div className={styles.field}>
        <Typography variant="body1">Дедлайн:</Typography>
        <AppTextField
          name="deadline"
          type="date"
          defaultValue={getInputDate(goal.deadline)}
          disabled={isUpdating || isDeleting}
        />
      </div>

      <div className={styles.field}>
        <Typography variant="body1">Накоплено:</Typography>
        <AppTextField
          name="amount"
          type="number"
          defaultValue={goal.amount}
          disabled={isUpdating || isDeleting}
        />
      </div>

      <div className={styles.field}>
        <Typography variant="body1">Итоговая сумма цели:</Typography>
        <AppTextField
          name="totalAmount"
          type="number"
          defaultValue={goal.total_amount}
          disabled={isUpdating || isDeleting}
        />
      </div>

      <Typography variant="body1" className={styles.leftAmount}>
        До цели осталось: {formatMoney(leftAmount > 0 ? leftAmount : 0)} ₽
      </Typography>

      <div className={styles.actions}>
        <AppButton type="submit" disabled={isUpdating || isDeleting}>
          {isUpdating ? "Сохранение..." : "Сохранить"}
        </AppButton>

        <AppButton
          type="button"
          variant="outlined"
          onClick={handleDelete}
          disabled={isUpdating || isDeleting}
        >
          {isDeleting ? "Удаление..." : "Удалить цель"}
        </AppButton>
      </div>
    </form>
  );
}
