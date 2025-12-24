import { Avatar, IconButton } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonIcon from "@mui/icons-material/Person";
import styles from "./AuthLayout.module.scss";

export default function AuthLayout({ children }) {
  return (
    <div className={styles.root}>
      <div className={styles.phone}>
        <div className={styles.header}>
          <Avatar className={styles.avatar}>
            <PersonIcon />
          </Avatar>

          <IconButton aria-label="Уведомления">
            <NotificationsNoneIcon />
          </IconButton>
        </div>

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
