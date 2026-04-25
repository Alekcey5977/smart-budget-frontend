import { Stack } from "@mui/material";
import BalanceWidget from "./BalanceWidget";
import HomeExpensesCard from "./HomeExpensesCard";
import HomeGoalsCard from "./HomeGoalsCard";
import HomeOperationsCard from "./HomeOperationsCard";
import styles from "./HomePage.module.scss";

export default function HomePage() {
  return (
    <div className={styles.content}>
      <Stack direction="row" spacing={2}>
        <HomeExpensesCard />
        <BalanceWidget />
      </Stack>

      <HomeGoalsCard />

      <HomeOperationsCard />
    </div>
  );
}
