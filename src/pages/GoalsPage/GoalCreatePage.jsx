import { Alert, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useCreateGoalMutation } from "services/goals/goalsApi";
import { getMonthsLeft } from "src/utils/date";
import { formatMoney } from "src/utils/formatMoney";
import AppButton from "ui/AppButton";
import AppTextField from "ui/AppTextField";
import styles from "./GoalCreatePage.module.scss";

export default function GoalCreatePage() {
  const navigate = useNavigate();
  const [errorText, setErrorText] = useState("");
  const [createGoal, { isLoading }] = useCreateGoalMutation();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      title: "",
      deadline: "",
      totalAmount: "",
    },
  });
  const deadline = watch("deadline");
  const totalAmount = watch("totalAmount");

  const monthlyHint = useMemo(() => {
    const total = Number(totalAmount || 0);
    if (!deadline || total <= 0) {
      return "";
    }

    const monthsLeft = Math.ceil(getMonthsLeft(deadline));
    if (monthsLeft <= 0) {
      return "Дедлайн должен быть позже текущей даты";
    }

    const monthlyAmount = total / monthsLeft;
    return `В среднем нужно откладывать ${formatMoney(monthlyAmount)} ₽ в месяц`;
  }, [deadline, totalAmount]);

  const onSubmit = async (data) => {
    setErrorText("");

    try {
      await createGoal({
        title: data.title.trim(),
        deadline: `${data.deadline}T00:00:00`,
        total_amount: Number(data.totalAmount),
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
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      {errorText && <Alert severity="error">{errorText}</Alert>}

      <div className={styles.field}>
        <Typography variant="body1">Название Цели:</Typography>
        <AppTextField
          {...register("title", {
            required: "Заполните поле",
          })}
          error={Boolean(errors.title)}
          helperText={errors.title?.message}
          disabled={isLoading}
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
          disabled={isLoading}
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
          disabled={isLoading}
        />
        {monthlyHint && (
          <Typography variant="body2" color="text.secondary">
            {monthlyHint}
          </Typography>
        )}
      </div>

      <div className={styles.actions}>
        <AppButton type="submit" disabled={isLoading}>
          {isLoading ? "Создание..." : "Создать цель"}
        </AppButton>
      </div>
    </form>
  );
}
