import { Stack } from "@mui/material";
import BalanceWidget from "./BalanceWidget";
import HomeExpensesCard from "./HomeExpensesCard";
import HomeGoalsCard from "./HomeGoalsCard";
import HomeOperationsCard from "./HomeOperationsCard";
import styles from "./HomePage.module.scss";

export default function HomePage() {
  return (
    <div className={styles.content}>
      <Stack direction="row" spacing={2} sx={{ width: "100%", alignItems: "stretch" }}>
        <div style={{ flex: 1.6, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <HomeExpensesCard />
        </div>

        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <BalanceWidget />
        </div>
      </Stack>

      <HomeGoalsCard />

      <HomeOperationsCard />
    </div>
  );
}
