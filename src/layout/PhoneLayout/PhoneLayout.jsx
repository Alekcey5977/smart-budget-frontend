import classNames from "classnames";
import styles from "./PhoneLayout.module.scss";

export default function PhoneLayout({ children, className }) {
  return (
    <div className={styles.root}>
      <div className={classNames(styles.phone, className)}>{children}</div>
    </div>
  );
}
