import { Alert, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import {
  useDeleteGoalMutation,
  useGetGoalsQuery,
  useUpdateGoalMutation,
} from "services/goals/goalsApi";
import { formatMoney } from "src/utils/formatMoney";
import { toInputDate } from "src/utils/date";
import AppButton from "ui/AppButton";
import AppTextField from "ui/AppTextField";
import styles from "./GoalDetailsPage.module.scss";

export default function GoalDetailsPage() {
  const { goalId } = useParams();
  const navigate = useNavigate();
  const { data: goals = [], isLoading, isError } = useGetGoalsQuery();
  const [updateGoal, { isLoading: isUpdating }] = useUpdateGoalMutation();
  const [deleteGoal, { isLoading: isDeleting }] = useDeleteGoalMutation();

  const [errorText, setErrorText] = useState("");
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      title: "",
      deadline: "",
      amount: "",
      totalAmount: "",
    },
  });

  const goal = goals.find((item) => item.id === goalId);

  useEffect(() => {
    if (!goal) {
      return;
    }

    reset({
      title: goal.title,
      deadline: toInputDate(goal.deadline),
      amount: goal.amount,
      totalAmount: goal.total_amount,
    });
  }, [goal, reset]);

  const leftAmount =
    Number(goal?.total_amount || 0) - Number(goal?.amount || 0);

  const handleSave = async (data) => {
    setErrorText("");

    try {
      await updateGoal({
        goalId,
        data: {
          title: data.title.trim(),
          deadline: `${data.deadline}T00:00:00`,
          amount: Number(data.amount || 0),
          total_amount: Number(data.totalAmount),
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
        <CircularProgress size={24} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.center}>
        <Alert severity="error" className={styles.alert}>
          Не удалось загрузить цель
        </Alert>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className={styles.center}>
        <Alert severity="warning" className={styles.alert}>
          Цель не найдена
        </Alert>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleSave)}>
      {errorText && <Alert severity="error">{errorText}</Alert>}

      <div className={styles.field}>
        <Typography variant="body1">Название цели:</Typography>
        <AppTextField
          {...register("title", {
            required: "Заполните поле",
          })}
          error={Boolean(errors.title)}
          helperText={errors.title?.message}
          disabled={isUpdating || isDeleting}
        />
      </div>

      <div className={styles.field}>
        <Typography variant="body1">Дедлайн:</Typography>
        <AppTextField
          {...register("deadline", {
            required: "Заполните поле",
          })}
          type="date"
          error={Boolean(errors.deadline)}
          helperText={errors.deadline?.message}
          disabled={isUpdating || isDeleting}
        />
      </div>

      <div className={styles.field}>
        <Typography variant="body1">Накоплено:</Typography>
        <AppTextField
          {...register("amount", {
            min: {
              value: 0,
              message: "Сумма не может быть меньше 0",
            },
          })}
          type="number"
          error={Boolean(errors.amount)}
          helperText={errors.amount?.message}
          disabled={isUpdating || isDeleting}
        />
      </div>

      <div className={styles.field}>
        <Typography variant="body1">Итоговая сумма цели:</Typography>
        <AppTextField
          {...register("totalAmount", {
            required: "Заполните поле",
            min: {
              value: 1,
              message: "Сумма должна быть больше 0",
            },
          })}
          type="number"
          error={Boolean(errors.totalAmount)}
          helperText={errors.totalAmount?.message}
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
