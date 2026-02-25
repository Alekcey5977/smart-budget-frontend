import { Typography } from "@mui/material";

import { formatDateRu } from "src/utils/date";
import { formatMoney } from "src/utils/formatMoney";
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

export default function GoalListItem({ goal, onOpen }) {
  const percent = getProgressPercent(goal.amount, goal.total_amount);

  return (
    <button
      type="button"
      className={styles.card}
      onClick={() => onOpen(goal.id)}
    >
      <div className={styles.cardHeader}>
        <Typography variant="subtitle1" fontWeight={700}>
          {goal.title}
        </Typography>

        <div className={styles.percent}>{percent}%</div>
      </div>

      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${percent}%` }} />
      </div>

      <Typography variant="body2" className={styles.cardText}>
        Накоплено {formatMoney(goal.amount)} ₽ из {formatMoney(goal.total_amount)} ₽
      </Typography>

      <Typography variant="body2" className={styles.cardText}>
        Дедлайн - {formatDateRu(goal.deadline)}
      </Typography>
    </button>
  );
}
