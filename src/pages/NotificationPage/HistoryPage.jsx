import { HistoryList } from "./NotificationsPage";
import styles from "./NotificationsPage.module.scss";

export default function HistoryPage() {
  return (
    <div className={styles.page}>
      <HistoryList />
    </div>
  );
}
