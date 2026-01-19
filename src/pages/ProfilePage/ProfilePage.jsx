import { Stack, Typography, Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

import AppButton from "ui/AppButton/AppButton";
import AppTextField from "ui/AppTextField/AppTextField";

import styles from "./ProfilePage.module.scss";

export default function ProfilePage() {
  const handleSave = () => {
    console.log("save");
  };

  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <Stack alignItems="center" spacing={2}>
          <Avatar className={styles.bigAvatar}>
            <PersonIcon />
          </Avatar>

          <Typography variant="h6" fontWeight={800}>
            user01.gmail.com
          </Typography>
        </Stack>

        <div className={styles.fields}>
          <Typography variant="body2" className={styles.label}>
            Фамилия
          </Typography>
          <AppTextField />

          <Typography variant="body2" className={styles.label}>
            Имя
          </Typography>
          <AppTextField />

          <Typography variant="body2" className={styles.label}>
            Отчество
          </Typography>
          <AppTextField />
        </div>
      </div>

      <div className={styles.bottom}>
        <AppButton onClick={handleSave}>Сохранить</AppButton>
      </div>
    </div>
  );
}
