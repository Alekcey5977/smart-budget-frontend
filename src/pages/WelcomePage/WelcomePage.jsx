import React from "react";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "./WelcomePage.module.scss";

function WelcomePage() {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.header}>
        <Typography
          component="h1"
          sx={{
            m: 0,
            fontWeight: 800,
            fontSize: 42,
            lineHeight: 1.15,
            color: "var(--color-text-main)",
          }}
        >
          Умный бюджет
        </Typography>

        <Typography
          component="p"
          sx={{
            mt: "12px",
            mb: 0,
            fontSize: 20,
            lineHeight: 1.35,
            color: "var(--color-muted-main)",
          }}
        >
          Учёт расходов стал проще
        </Typography>
      </div>

      <div className={styles.spacer} />

      <div className={styles.buttonsBlock}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate("/login")}
          sx={{
            height: 78,
            borderRadius: "20px",
            fontSize: 22,
            letterSpacing: "0.26em",
            textTransform: "none",
            fontWeight: 400,
            bgcolor: "var(--color-accent-main)",
            color: "var(--color-text-main)",
            boxShadow: "none",
            "&:hover": {
              bgcolor: "var(--color-accent-main)",
              boxShadow: "none",
            },
          }}
        >
          Авторизация
        </Button>

        <Button
          variant="outlined"
          fullWidth
          onClick={() => console.log("Регистрация позже")}
          sx={{
            height: 78,
            borderRadius: "20px",
            fontSize: 22,
            letterSpacing: "0.26em",
            textTransform: "none",
            fontWeight: 400,
            border: "2px solid var(--color-accent-main)",
            color: "var(--color-text-main)",
            "&:hover": {
              border: "2px solid var(--color-accent-main)",
            },
          }}
        >
          Регистрация
        </Button>
      </div>
    </>
  );
}

export default WelcomePage;
