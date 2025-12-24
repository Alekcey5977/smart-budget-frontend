import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styles from "./UnauthLayout.module.scss";

export default function UnauthLayout({ children, showBack = false }) {
  const navigate = useNavigate();

  return (
    <div className={styles.root}>
      <div className={styles.phone}>
        {showBack && (
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
        )}

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
