import { Avatar, IconButton } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonIcon from "@mui/icons-material/Person";
import { Outlet } from "react-router-dom";

import PhoneLayout from "layout/PhoneLayout/PhoneLayout";
import styles from "./AuthLayout.module.scss";

export default function AuthLayout() {
  return (
    <PhoneLayout>
      <div className={styles.header}>
        <Avatar className={styles.avatar}>
          <PersonIcon />
        </Avatar>

        <IconButton aria-label="Уведомления">
          <NotificationsNoneIcon />
        </IconButton>
      </div>

      <div className={styles.content}>
        <Outlet />
      </div>
    </PhoneLayout>
  );
}
