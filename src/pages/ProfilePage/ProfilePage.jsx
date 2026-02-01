import { Stack, Typography } from "@mui/material";
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
          <div className={styles.avatar}>
            <PersonIcon style={{ fontSize: 40, opacity: 0.6 }} />
          </div>

          <Typography variant="h6" fontWeight={800}>
            user01.gmail.com
          </Typography>
        </Stack>

        <div className={styles.fields}>
          <AppTextField label="Фамилия" />
          <AppTextField label="Имя" />
          <AppTextField label="Отчество" />
        </div>
      </div>

      <div className={styles.bottom}>
        <AppButton onClick={handleSave}>Сохранить</AppButton>
      </div>
    </div>
  );
}
