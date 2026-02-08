import { IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

import PhoneLayout from "layout/PhoneLayout";
import styles from "./PageLayout.module.scss";

export default function PageLayout({ title, children }) {
  const navigate = useNavigate();

  return (
    <PhoneLayout>
      <div className={styles.header}>
        <IconButton
          className={styles.backButton}
          onClick={() => navigate(-1)}
          aria-label="Назад"
          sx={{
            width: 47,
            height: 37,
            borderRadius: "15px",
            bgcolor: "primary.main",
            color: "text.primary",
            "&:hover": { bgcolor: "primary.main" },
          }}
        >
          <ArrowBackIcon fontSize="small" />
        </IconButton>

        <Typography variant="h6" component="h1" className={styles.title}>
          {title}
        </Typography>

        <div className={styles.rightSpace} />
      </div>

      <div className={styles.content}>{children}</div>
    </PhoneLayout>
  );
}
