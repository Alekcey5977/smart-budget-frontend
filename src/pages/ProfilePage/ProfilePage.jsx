import { Stack, Typography, Button } from "@mui/material";

import AppTextField from "ui/AppTextField/AppTextField";
import AppAvatar from "ui/AppAvatar";
import styles from "./ProfilePage.module.scss";
import { useCallback } from "react";

export default function ProfilePage() {
  const handleSave = useCallback(() => {
    console.log("save");
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <Stack alignItems="center" spacing={2}>
          <AppAvatar size="xl" />

          <Typography variant="h6" fontWeight={800}>
            user01.gmail.com
          </Typography>
        </Stack>

        <div className={styles.fields}>
          <AppTextField placeholder="Фамилия" />
          <AppTextField placeholder="Имя" />
          <AppTextField placeholder="Отчество" />
        </div>
      </div>

      <div className={styles.bottom}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleSave}
          sx={{
            height: 78,
            borderRadius: 20,
            boxShadow: "none",
            textTransform: "none",
            "&:hover": { boxShadow: "none" },
          }}
        >
          Сохранить
        </Button>
      </div>
    </div>
  );
}
