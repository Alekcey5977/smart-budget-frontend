import { useNavigate } from "react-router-dom";
import styles from "./UnauthLayout.module.scss";

const UnauthLayout = ({ children, showBack = false }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.root}>
      <div className={styles.phone}>
        {showBack && (
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate(-1)}
            aria-label="Назад"
          >
            ←
          </button>
        )}

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default UnauthLayout;
