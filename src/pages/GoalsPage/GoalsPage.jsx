import { Alert, CircularProgress, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useGetGoalsQuery } from "services/goals/goalsApi";
import { formatDateRu } from "src/utils/date";
import { formatMoney } from "src/utils/formatMoney";
import AppButton from "ui/AppButton";
import styles from "./GoalsPage.module.scss";

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

  const renderGoalsContent = () => {
    if (isLoading) {
      return (
        <div className={styles.state}>
          <CircularProgress size={24} />
        </div>
      );
    }

    if (isError) {
      return (
        <div className={styles.state}>
          <Alert severity="error" className={styles.alert}>
            Не удалось загрузить цели
          </Alert>
        </div>
      );
    }

    if (goals.length === 0) {
      return (
        <div className={styles.state}>
          <Typography variant="body2" color="text.secondary">
            Целей нет
          </Typography>
        </div>
      );
    }

    return (
      <div className={styles.list}>
        {goals.map((goal) => {
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
                Дедлайн - {formatDateRu(goal.deadline)}
              </Typography>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        {renderGoalsContent()}
      </div>

      <div className={styles.actions}>
        <AppButton onClick={() => navigate("/goals/create")}>
          Создать цель
        </AppButton>
      </div>
    </div>
  );
}
