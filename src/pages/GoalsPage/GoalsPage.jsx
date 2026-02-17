import { CircularProgress, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useGetGoalsQuery } from "services/goals/goalsApi";
import AppButton from "ui/AppButton";
import styles from "./GoalsPage.module.scss";

const moneyFormatter = new Intl.NumberFormat("ru-RU");

function formatMoney(value) {
  return moneyFormatter.format(Number(value || 0));
}

function formatDeadline(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getProgressPercent(amount, totalAmount) {
  const amountNumber = Number(amount || 0);
  const totalNumber = Number(totalAmount || 0);
  if (totalNumber <= 0) {
    return 0;
  }
  const percent = Math.round((amountNumber / totalNumber) * 100);
  if (percent < 0) {
    return 0;
  }
  if (percent > 100) {
    return 100;
  }
  return percent;
}

export default function GoalsPage() {
  const navigate = useNavigate();
  const { data: goals = [], isLoading, isError } = useGetGoalsQuery();

  return (
    <div className={styles.root}>
      <div className={styles.list}>
        {isLoading && (
          <div className={styles.center}>
            <CircularProgress size={24} />
          </div>
        )}

        {isError && (
          <div className={styles.center}>
            <Typography variant="body2" color="text.secondary">
              Не удалось загрузить цели
            </Typography>
          </div>
        )}

        {!isLoading && !isError && goals.length === 0 && (
          <div className={styles.center}>
            <Typography variant="body2" color="text.secondary">
              Целей нет
            </Typography>
          </div>
        )}

        {!isLoading &&
          !isError &&
          goals.map((goal) => {
            const percent = getProgressPercent(goal.amount, goal.total_amount);

            return (
              <button
                key={goal.id}
                type="button"
                className={styles.card}
                onClick={() => navigate(`/goals/${goal.id}`)}
              >
                <div className={styles.cardHeader}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {goal.title}
                  </Typography>

                  <div className={styles.percent}>{percent}%</div>
                </div>

                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <Typography variant="body2" className={styles.cardText}>
                  Накоплено {formatMoney(goal.amount)} ₽ из{" "}
                  {formatMoney(goal.total_amount)} ₽
                </Typography>

                <Typography variant="body2" className={styles.cardText}>
                  Дедлайн - {formatDeadline(goal.deadline)}
                </Typography>
              </button>
            );
          })}
      </div>

      <div className={styles.actions}>
        <AppButton onClick={() => navigate("/goals/create")}>
          Создать цель
        </AppButton>
      </div>
    </div>
  );
}
