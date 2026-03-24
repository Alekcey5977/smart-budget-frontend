import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useGetGoalsQuery } from "services/goals/goalsApi";
import styles from "./HomePage.module.scss";

function getProgress(amount, totalAmount) {
  const current = Number(amount || 0);
  const total = Number(totalAmount || 0);
  if (total <= 0) {
    return 0;
  }

  const percent = Math.round((current / total) * 100);
  if (percent < 0) {
    return 0;
  }
  if (percent > 100) {
    return 100;
  }
  return percent;
}

export default function HomeGoalsCard() {
  const navigate = useNavigate();
  const { data: goals = [], isLoading } = useGetGoalsQuery();
  const dashboardGoals = goals.slice(0, 2);

  return (
    <Paper
      variant="outlined"
      className={`${styles.cardWide} ${styles.cardLink}`}
      onClick={() => navigate("/goals")}
    >
      <Typography variant="subtitle1" fontWeight={700}>
        Цели
      </Typography>

      {isLoading || dashboardGoals.length === 0 ? (
        <div className={styles.center}>
          <Typography variant="body2" color="text.secondary">
            {isLoading ? "Загрузка..." : "Целей нет"}
          </Typography>
        </div>
      ) : (
        <div className={styles.goalsMiniList}>
          {dashboardGoals.map((goal) => {
            const progress = getProgress(goal.amount, goal.total_amount);

            return (
              <div key={goal.id} className={styles.goalMiniCard}>
                <Box sx={{ position: "relative", width: 80, height: 80 }}>
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size={80}
                    thickness={7}
                    sx={{
                      color: "rgba(0,0,0,0.08)",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  />

                  <CircularProgress
                    variant="determinate"
                    value={progress}
                    size={80}
                    thickness={7}
                    sx={{
                      color: "primary.main",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  />

                  <div className={styles.goalPercent}>{progress}%</div>
                </Box>

                <Typography variant="body2" className={styles.goalMiniTitle}>
                  {goal.title}
                </Typography>
              </div>
            );
          })}
        </div>
      )}
    </Paper>
  );
}
