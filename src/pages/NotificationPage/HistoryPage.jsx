import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { HistoryList } from "./NotificationsPage";
import styles from "./NotificationsPage.module.scss";

export default function HistoryPage() {
  const navigate = useNavigate();

  const handleNotificationClick = useCallback(
    (item) => {
      if (item.id) {
        navigate(`/notifications/${item.id}`, {
          state: {
            type: "history",
          },
        });
      }
    },
    [navigate],
  );

  return (
    <div className={styles.page}>
      <HistoryList onNotificationClick={handleNotificationClick} />
    </div>
  );
}
