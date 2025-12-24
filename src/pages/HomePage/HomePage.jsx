import { Paper, Stack, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";

import AuthLayout from "../../layout/AuthLayout";
import styles from "./HomePage.module.scss";

export default function HomePage() {
  return (
    <AuthLayout>
      <div className={styles.content}>
        <Stack direction="row" spacing={2}>
          <Paper variant="outlined" className={styles.card}>
            <Typography variant="subtitle1" fontWeight={700} mb={1}>
              Расходы за ноябрь
            </Typography>

            <div className={styles.cardRow}>
              <Typography variant="body2" color="text.secondary">
                Расходов нет
              </Typography>
            </div>
          </Paper>

          <Paper variant="outlined" className={styles.card}>
            <Typography variant="subtitle1" fontWeight={700} mb={0.5}>
              Баланс
            </Typography>

            <Typography variant="body2" fontWeight={700} mb={1}>
              Выбрать счёт
            </Typography>

            <div className={styles.cardRow}>
              <CreditCardOutlinedIcon />

              <IconButton
                aria-label="Добавить"
                sx={{
                  bgcolor: "primary.main",
                  width: 44,
                  height: 44,
                  borderRadius: 3,
                  "&:hover": { bgcolor: "primary.main" },
                }}
              >
                <AddIcon />
              </IconButton>
            </div>
          </Paper>
        </Stack>

        <Paper variant="outlined" className={styles.cardWide}>
          <Typography variant="subtitle1" fontWeight={700}>
            Цели
          </Typography>

          <div className={styles.center}>
            <Typography variant="body2" color="text.secondary">
              Целей нет
            </Typography>
          </div>
        </Paper>

        <Paper variant="outlined" className={styles.cardWideLarge}>
          <Typography variant="subtitle1" fontWeight={700}>
            Последние операции
          </Typography>

          <div className={styles.center}>
            <Typography variant="body2" color="text.secondary">
              Операций нет
            </Typography>
          </div>
        </Paper>
      </div>
    </AuthLayout>
  );
}
