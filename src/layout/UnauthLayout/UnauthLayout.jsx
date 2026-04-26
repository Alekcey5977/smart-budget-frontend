import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

import PhoneLayout from "layout/PhoneLayout";
import styles from "./UnauthLayout.module.scss";

export default function UnauthLayout({
  children,
  showBack = false,
  title,
  subtitle,
  onBack,
}) {
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
      return;
    }
    navigate("/");
  }, [onBack, navigate]);

  return (
    <PhoneLayout>
      {showBack && (
        <IconButton
          className={styles.backButton}
          onClick={handleBack}
          aria-label="На главную"
          sx={{
            width: 47,
            height: 37,
            borderRadius: "15px",
            bgcolor: "primary.main",
            color: "text.primary",
            "&:hover": { bgcolor: "primary.main" },
          }}
        >
          <HomeIcon fontSize="small" />
        </IconButton>
      )}

      <div className={styles.content}>
        <div className={styles.header}>
          {title && (
            <Typography variant="h4" component="h1">
              {title}
            </Typography>
          )}

          {subtitle && (
            <Typography
              variant="body1"
              component="p"
              className={styles.subtitle}
              color="text.secondary"
            >
              {subtitle}
            </Typography>
          )}
        </div>

        <div className={styles.bottom}>{children}</div>
      </div>
    </PhoneLayout>
  );
}
