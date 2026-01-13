import styles from "./PhoneLayout.module.scss";

export default function PhoneLayout({ children }) {
  return (
    <div className={styles.root}>
      <div className={styles.phone}>{children}</div>
    </div>
  );
}
