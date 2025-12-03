import React from 'react';
import { Button, Typography } from '@mui/material';
import styles from './WelcomePage.module.scss';

function WelcomePage() {
  const handleAuthClick = () => {
    console.log('Нажата кнопка Авторизация');
  };

  const handleRegisterClick = () => {
    console.log('Нажата кнопка Регистрация');
  };

  return (
    <div className={styles.root}>
      <div className={styles.phone}>
        <div className={styles.header}>
          <Typography component="h1" className={styles.title}>
            Умный бюджет
          </Typography>

          <Typography component="p" className={styles.subtitle}>
            Учёт расходов стал проще
          </Typography>
        </div>

        <div className={styles.spacer} />

        <div className={styles.buttonsBlock}>
          <Button
            variant="contained"
            fullWidth
            className={styles.primaryButton}
            onClick={handleAuthClick}
          >
            Авторизация
          </Button>

          <Button
            variant="outlined"
            fullWidth
            className={styles.secondaryButton}
            onClick={handleRegisterClick}
          >
            Регистрация
          </Button>
        </div>
        
      </div>
    </div>
  );
}

export default WelcomePage;
