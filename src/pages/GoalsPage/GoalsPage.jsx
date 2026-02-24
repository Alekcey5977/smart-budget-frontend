import { Alert, CircularProgress, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useGetGoalsQuery } from "services/goals/goalsApi";
import AppButton from "ui/AppButton";
import GoalListItem from "./GoalListItem";
import styles from "./GoalsPage.module.scss";

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
        {goals.map((goal) => (
          <GoalListItem
            key={goal.id}
            goal={goal}
            onOpen={(id) => navigate(`/goals/${id}`)}
          />
        ))}
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
