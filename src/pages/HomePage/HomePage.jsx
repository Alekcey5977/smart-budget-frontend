import {
  Paper,
  Stack,
  Typography,
  IconButton,
  Box,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import { useNavigate } from "react-router-dom";

import styles from "./HomePage.module.scss";

function DonutPlaceholder() {
  return (
    <Box sx={{ position: "relative", width: 75, height: 75 }}>
      <CircularProgress
        variant="determinate"
        value={100}
        size={75}
        thickness={11}
        sx={{
          color: "rgba(0,0,0,0.25)",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
    </Box>
  );
}

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className={styles.content}>
      <Stack direction="row" spacing={2}>
        <Paper variant="outlined" className={styles.card}>
          <Typography variant="subtitle1" fontWeight={700}>
            Расходы за ноябрь
          </Typography>

          <div className={styles.cardRow}>
            <div className={styles.cardRowLeft}>
              <Typography variant="body2" color="text.secondary">
                Расходов нет
              </Typography>
            </div>

            <div className={styles.donutWrap}>
              <DonutPlaceholder />
            </div>
          </div>
        </Paper>

        <Paper variant="outlined" className={styles.card}>
          <Typography variant="subtitle1" fontWeight={700}>
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

      <Paper
        variant="outlined"
        className={`${styles.cardWide} ${styles.cardLink}`}
        onClick={() => navigate("/goals")}
      >
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
  );
}
