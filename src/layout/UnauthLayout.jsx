import { Typography } from "@mui/material";
import PhoneLayout from "../layout/PhoneLayout/PhoneLayout";
import styles from "./UnauthLayout.module.scss";

export default function UnauthLayout({
  children,
  showBack = false,
  title,
  subtitle,
  headerAlign = "right",
  headerTop = "clamp(140px, 22vh, 220px)",
}) {
  const isRight = headerAlign === "right";

  return (
    <PhoneLayout showBack={showBack}>
      <div className={styles.content} style={{ "--header-top": headerTop }}>
        <div className={`${styles.header} ${isRight ? styles.headerRight : ""}`}>
          {title && (
            <Typography variant="h4" component="h1" className={styles.title}>
              {title}
            </Typography>
          )}

          {subtitle && (
            <Typography variant="body1" component="p" className={styles.subtitle}>
              {subtitle}
            </Typography>
          )}
        </div>

        <div className={styles.bottom}>{children}</div>
      </div>
    </PhoneLayout>
  );
}
