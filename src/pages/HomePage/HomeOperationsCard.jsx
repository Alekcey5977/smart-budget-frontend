import { CircularProgress, Paper, Typography } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useGetTransactionsQuery } from "services/transactions/transactionsApi";
import {
  formatOperationDateShort,
  getOperationColor,
  getOperationSignedAmount,
  getOperationTitle,
  isIncomeOperation,
} from "utils/operationHelpers";
import styles from "./HomePage.module.scss";

function HomeOperationsContent({
  isLoading,
  isError,
  operations,
  onOperationClick,
}) {
  if (isLoading) {
    return (
      <div className={styles.center}>
        <CircularProgress size={24} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.center}>
        <Typography variant="body2" color="text.secondary">
          Не удалось загрузить операции
        </Typography>
      </div>
    );
  }

  if (operations.length === 0) {
    return (
      <div className={styles.center}>
        <Typography variant="body2" color="text.secondary">
          Операций нет
        </Typography>
      </div>
    );
  }

  return (
    <div className={styles.operationsList}>
      {operations.map((operation) => (
        <button
          key={operation.id}
          type="button"
          className={styles.operationItem}
          onClick={(event) => {
            event.stopPropagation();
            onOperationClick(operation);
          }}
        >
          <div
            className={styles.operationCircle}
            style={{ backgroundColor: getOperationColor(operation) }}
          />

          <div className={styles.operationMain}>
            <div className={styles.operationTitle}>{getOperationTitle(operation)}</div>

            <div className={styles.operationDate}>
              {formatOperationDateShort(operation.created_at)}
            </div>
          </div>

          <div
            className={
              isIncomeOperation(operation)
                ? styles.operationIncome
                : styles.operationExpense
            }
          >
            {getOperationSignedAmount(operation)}
          </div>
        </button>
      ))}
    </div>
  );
}

export default function HomeOperationsCard() {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetTransactionsQuery({
    limit: 3,
    offset: 0,
  });

  const operations = useMemo(
    () => (Array.isArray(data) ? data : []),
    [data],
  );

  const handleOpenOperation = (operation) => {
    navigate(`/operations/${operation.id}`, {
      state: { operation },
    });
  };

  return (
    <Paper
      variant="outlined"
      className={`${styles.cardWideLarge} ${styles.cardLink}`}
      onClick={() => navigate("/operations")}
    >
      <Typography variant="subtitle1" fontWeight={700}>
        Последние операции
      </Typography>

      <HomeOperationsContent
        isLoading={isLoading}
        isError={isError}
        operations={operations}
        onOperationClick={handleOpenOperation}
      />

      {!isLoading && !isError && operations.length > 0 && (
        <button
          type="button"
          className={styles.showMoreButton}
          onClick={(event) => {
            event.stopPropagation();
            navigate("/operations");
          }}
        >
          Показать ещё
        </button>
      )}
    </Paper>
  );
}
