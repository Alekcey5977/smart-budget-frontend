import { Stack } from "@mui/material";
import BalanceWidget from "./BalanceWidget";
import HomeExpensesCard from "./HomeExpensesCard";
import HomeGoalsCard from "./HomeGoalsCard";
import HomeOperationsCard from "./HomeOperationsCard";
import styles from "./HomePage.module.scss";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className={styles.content}>
      <Stack direction="row" spacing={2}>
        <HomeExpensesCard />
        <BalanceWidget />
      </Stack>

      <Paper
        variant="outlined"
        className={`${styles.cardWide} ${styles.cardLink}`}
        onClick={() => navigate("/goals")}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          Цели
        </Typography>
        <div className={styles.center}>
          <Typography variant="body2" color="text.secondary">
            Целей нет
          </Typography>
        </div>
      </Paper>

      <HomeOperationsCard />
    </div>
  );
}
